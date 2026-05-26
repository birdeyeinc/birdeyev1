import piexif from "piexifjs";
import { isEmpty } from "lodash";

// Comprehensive MIME type mapping for file extensions
const MIME_MAP = {
    // Image formats
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.bmp': 'image/bmp',
    '.heic': 'image/heic',
    '.heif': 'image/heif',
    '.avif': 'image/avif',

    // Document formats
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xlsm': 'application/vnd.ms-excel.sheet.macroEnabled.12',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.vcf': 'text/vcard',
    '.html': 'text/html',
    '.htm': 'text/html',
    '.rtf': 'application/rtf',
    '.odt': 'application/vnd.oasis.opendocument.text',
    '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
    '.odp': 'application/vnd.oasis.opendocument.presentation',

    // Audio formats
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.aac': 'audio/aac',
    '.flac': 'audio/flac',
    '.midi': 'audio/midi',
    '.mid': 'audio/midi',
    '.m4a': 'audio/x-m4a',
    '.weba': 'audio/webm',

    // Video formats
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogv': 'video/ogg',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.wmv': 'video/x-ms-wmv',
    '.3gp': 'video/3gpp',
    '.3g2': 'video/3gpp2',
    '.flv': 'video/x-flv',
    '.mpeg': 'video/mpeg',
    '.mpg': 'video/mpeg',

    // Archive formats
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.7z': 'application/x-7z-compressed',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip',
    '.bz2': 'application/x-bzip2',

    // Code formats
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.xml': 'application/xml',
    '.md': 'text/markdown',
    '.php': 'application/x-httpd-php',
    '.sh': 'application/x-sh',
    '.py': 'application/x-python',
    '.java': 'text/x-java-source',
    '.c': 'text/x-c',
    '.cpp': 'text/x-c',
    '.h': 'text/x-c',

    // Font formats
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.eot': 'application/vnd.ms-fontobject'
};

export const imageContainsExifData = (dataURL) => {
    let containsExifData = false;
    try {
        let exifObj = piexif.load(dataURL);
        if (!isEmpty(exifObj["Exif"]) || !isEmpty(exifObj["GPS"])) {
            containsExifData = true;
        }
    } catch (e) {
        console.log("Exif data check error: ", e);
    }

    return containsExifData;
};
export function hasScriptTagsInImage(imageContent, imageType) {
    const parser = new DOMParser();
    const imageDOM = parser.parseFromString(imageContent, imageType);

    const scriptTags = imageDOM.getElementsByTagName("script");
    return scriptTags.length > 0;
}
export const checkFileUploadFromSocialModules = () => {
    const routes = ["dashboard/social/publish/createpost", "dashboard/setup/response/auto-share/ruleview", "dashboard/social/asset-library", "dashboard/reseller/setup/response/auto-share/ruleview"];
    return routes.some(el => (window?.location?.pathname)?.includes(el));
};
export const removeExifData = (fileContent, fileType, compressionQuality = 0.8) => {
    return new Promise((resolve, reject) => {
        const hasExifData = imageContainsExifData(fileContent);

        if (hasExifData) {
            if (checkFileUploadFromSocialModules()) {
                try {
                    const obj = piexif.remove(fileContent);
                    resolve(obj);
                } catch (e) {
                    reject(new Error("Failed to load image."));
                }
            } else {
                //Drawing the same image on canvas (so that new img doesn't contain any exif info) and returning the base64 dataURL
                const img = new Image();

                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");

                    const width = img.width;
                    const height = img.height;

                    canvas.width = width;
                    canvas.height = height;

                    context.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        function (blob) {
                            const reader = new FileReader();
                            reader.onloadend = function () {
                                const compressedFileContent = reader.result;
                                resolve(compressedFileContent);
                            };
                            reader.readAsDataURL(blob);
                        },
                        fileType,
                        compressionQuality
                    );
                };

                img.onerror = function () {
                    reject(new Error("Failed to load image."));
                };

                img.src = fileContent;
            }
        } else {
            resolve(fileContent);
        }
    });
}
export const isSVGContentAvailable = (dataUrl) => {
    try {
        let base64String = dataUrl.split(',')[1];
        // Decode the base64 string to a text string
        let decodedString = atob(base64String);

        // Trim any whitespace and check if it starts with an SVG tag or XML declaration
        let trimmedString = decodedString.trim();
        return trimmedString.startsWith('<svg') || trimmedString.startsWith('<?xml');
    } catch {
        console.log("Error occured while checking svg content");
    }
};

// Enhanced getMimeTypeForExtension function with the comprehensive mapping
function getMimeTypeForExtension(extension) {
    // Ensure extension starts with a dot
    if (!extension.startsWith('.')) {
        extension = `.${extension}`;
    }

    return MIME_MAP[extension.toLowerCase()] || null;
}

// Reverse function - get extensions for a MIME type
export function getExtensionsForMimeType(mimeType) {
    const extensions = [];

    for (const [ext, mime] of Object.entries(MIME_MAP)) {
        if (mime === mimeType) {
            extensions.push(ext);
        }
    }

    return extensions;
}

// Convert legacy string format to new object format with comprehensive MIME mapping
export function convertLegacyAcceptProp(legacyAcceptString) {
    if (!legacyAcceptString) return {};

    const acceptConfig = {};
    const items = Array.isArray(legacyAcceptString) ? legacyAcceptString : legacyAcceptString.split(',');

    items.forEach(item => {
        item = item.trim();

        // Handle category wildcards like "image/*"
        if (item.includes('/*')) {
            acceptConfig[item] = [];
        }
        // Handle file extensions like ".jpg"
        else if (item.startsWith('.')) {
            const mimeType = getMimeTypeForExtension(item);
            if (mimeType) {
                acceptConfig[mimeType] = acceptConfig[mimeType] || [];
                acceptConfig[mimeType].push(item);
                // Also accept legacy MIME type for vCard files (text/x-vcard)
                // to support drag & drop across all browsers/OS
                if (mimeType === 'text/vcard') {
                    acceptConfig['text/x-vcard'] = acceptConfig['text/x-vcard'] || [];
                    acceptConfig['text/x-vcard'].push(item);
                }
            }
        }
        // Handle MIME types like "application/pdf"
        else {
            acceptConfig[item] = acceptConfig[item] || [];
        }
    });

    return acceptConfig;
}