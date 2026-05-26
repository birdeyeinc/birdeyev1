import { Editor } from "grapesjs";
import { SocialLinkOption, SOCIAL_LINK_OPTIONS } from "../../utils/constants";

export const DEFAULT_SOCIAL_LINKS_HTML = `
    <style>
        .social-links-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding-top: 10px;
            padding-bottom: 10px;
        }

        .social-links-wrapper {
            display: flex;
            gap: 8px;
            width: max-content;
            justify-content: center;
            align-items: center;
        }

    </style>
    <div data-component-type="social-links" data-gjs-droppable="false" class="social-links-container">
        <div class="social-links-wrapper">
            <a id="social-link-facebook" data-social-link="facebook" class="social-link" style="padding: 0 3px; display: inline-block;" href="https://www.facebook.com" target="_blank">
                <img src="https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/Facebook.svg" alt="Facebook" width="30" height="30">
            </a>

            <a id="social-link-instagram" data-social-link="instagram" class="social-link" style="padding: 0 3px; display: inline-block;" href="https://www.instagram.com" target="_blank">
                <img src="https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/Instagram.svg" alt="Instagram" width="30" height="30">
            </a>

            <a id="social-link-google" data-social-link="google" class="social-link" style="padding: 0 3px; display: inline-block;" href="https://www.google.com" target="_blank">
                <img src="https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/google.svg" alt="Google" width="30" height="30">
            </a>
        </div>
    </div>
`;
type GetSocialLinkHTMLProps = Pick<SocialLinkOption, "value" | "href" | "label" | "image">;

export function getSocialLinkHTML({ value, href, label, image }: GetSocialLinkHTMLProps) {
    const isEmail = value === "email";
    return `
    <a id="social-link-${value}" data-social-link=${value} class="social-link" style="padding: 0 3px;" href="${isEmail ? `mailto:${href}` : href}" target="_blank">
        <img src="${image}" alt="${label}" width="30" height="30">
    </a>
    `;
}

export function socialLinks(editor: Editor) {
    editor?.DomComponents?.addType("social-links", {
        isComponent: (el) => el?.dataset?.componentType === "social-links",
        model: {
            defaults: {
                name: "Social Links",
                draggable: true,
                droppable: false,
                editable: false,
                traits: [
                    {
                        type: "sortable-links",
                        label: "Socials",
                        name: "socials",
                        value: SOCIAL_LINK_OPTIONS?.slice(0, 3),
                        // @ts-ignore
                        socialOptions: SOCIAL_LINK_OPTIONS,
                        changeProp: true,
                        setValue: ({ component, value, trait, emitUpdate }) => {
                            const linkContainer = component?.find(`.social-links-wrapper`)[0];
                            const selectedValue = value as SocialLinkOption[];
                            const newComponents = selectedValue?.map((item) => {
                                const { label, image, href } = item;
                                return getSocialLinkHTML({ value: item?.value, label, image, href });
                            });
                            // remove already selected options from socialOptions
                            trait.set("socialOptions" as any, SOCIAL_LINK_OPTIONS.filter((option) => !selectedValue.find((sel) => sel.value === option.value)));
                            linkContainer?.components(newComponents);
                            emitUpdate();
                        },
                        getValue: ({ component, trait }) => {
                            const linkContainer = component?.find(`.social-links-wrapper`)[0];
                            const socialComponents = linkContainer?.find(`.social-link`);
                            if (socialComponents?.length) {
                                const selectedValues = socialComponents?.map((comp) => {
                                    const value = comp?.getAttributes()?.[`data-social-link`];
                                    const href = comp?.getAttributes()?.href;
                                    const option = SOCIAL_LINK_OPTIONS?.find((option) => option?.value === value);
                                    if (!option) return null;
                                    return { ...option, href };
                                })?.filter(Boolean);
                                // remove selected options from socialOptions
                                trait.set("socialOptions" as any, SOCIAL_LINK_OPTIONS.filter((option) => !selectedValues?.find((sel) => sel?.value === option.value)));
                                if (selectedValues?.length) return selectedValues;
                            }
                            return SOCIAL_LINK_OPTIONS?.slice(0, 3);
                        }
                    },
                ],
            }
        }
    });
}