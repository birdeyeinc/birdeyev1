import React, {  useMemo, useState } from "react";
import type { Trait } from "grapesjs";
import placeholderImage from "assets/images/placeholder-image.svg";
import TextArea from "atoms/TextArea";
import FilePreview from "components/FilePreview";
import styles from "../traits/trait-property-field.module.scss";

interface ImageTraitProps {
    trait: Trait;
}

interface MediaItem {
    type: string;
    preview: any;
    data: any;
    isUploading?: boolean;
}

export const ImageTrait = ({ trait }: ImageTraitProps) => {
    const value = trait?.getValue();
    const isDefaultSVG = value && value?.startsWith("<svg");
    const isValueEmpty = isDefaultSVG || !value; // Check if the value is empty or an SVG placeholder
    const initialValue = !isValueEmpty ? [{ type: "image", preview: value, data: value }] : [];
    const [mediaSequence, setMediaSequence] = useState<MediaItem[]>(initialValue);
    const isEmpty = mediaSequence?.length === 0;
    const currentValue = trait?.getValue();

    const syncedMediaSequence = useMemo(() => {
        const isUploading = mediaSequence?.some(item => item.isUploading);
        if (isUploading) {
            return mediaSequence;
        }

        if (currentValue && currentValue !== '') {
            // If trait has value but mediaSequence doesn't match, sync it
            if (mediaSequence.length === 0 ||
                (mediaSequence[0] &&
                    mediaSequence[0].data !== currentValue &&
                    mediaSequence[0].preview !== currentValue)) {
                return [{
                    type: "image",
                    preview: currentValue,
                    data: currentValue,
                }];
            }
        } else {
            // If trait is empty (after undo), clear mediaSequence
            if (mediaSequence?.length > 0) {
                return [];
            }
        }

        return mediaSequence;
    }, [currentValue, mediaSequence]);

    if (JSON.stringify(mediaSequence) !== JSON.stringify(syncedMediaSequence)) {
        setMediaSequence(syncedMediaSequence);
    }
    const handleRemoveMediaSequence = () => {
        setMediaSequence([]);
        trait.setValue(null); // Clear the trait value when removing the image
    }
    const displayMediaSequence = mediaSequence;
   
    return (
        <div className={`image-trait-container ${styles["image-trait-container"]}`}>
            {/* PLACEHOLDERS AND PREVIEW */}
             <label className="label-outside mb-10">{trait?.getLabel()}</label>
            {isEmpty ? (
                <div className="placeholder-image-container display-flex justify-content-center align-items-center">
                    <img className="placeholder-image" src={placeholderImage} />
                </div>
            ) : (
                <div className={`${styles["image-trait-preview"]} image-trait-preview`}>
                    <FilePreview
                        showLoadingState
                        mediaSequence={displayMediaSequence}
                        removeMediaSequencePreview={handleRemoveMediaSequence}
                        removeImagePreview={handleRemoveMediaSequence}
                        removeFilePreviewHandler={handleRemoveMediaSequence}
                        removeOtherFilePreview={handleRemoveMediaSequence}
                    />
                </div>
            )}

            <div className="mt-15">
                <TextArea
                    key={trait?.component?.getId()}
                    isRequired={false}
                    label="Image URL"
                    name="Image URL"
                    className={`image-url-input ${styles["image-url-input"]}`}
                    placeholder="Enter image URL"
                    value={isValueEmpty ? undefined : value}
                    onChange={(e: any) => trait?.setValue(e?.target?.value)}
                />
            </div>
        </div>
    );
};
