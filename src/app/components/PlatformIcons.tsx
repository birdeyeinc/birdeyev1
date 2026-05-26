/**
 * Shared platform icon components — identical to CalendarView icons.
 * Import these anywhere you need Facebook / Instagram / LinkedIn logos.
 */
import svgPaths from '../../imports/svg-q05k7ytov1';

export function FacebookIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute bg-[#337fff] inset-[0_-0.01%_0_0.01%] rounded-[10.591px]" />
      <div className="absolute inset-[25.11%_35.93%_24.84%_36.99%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.41425 10.0089">
          <path d={svgPaths.p3dc9c800} fill="white" />
        </svg>
      </div>
    </div>
  );
}

export function InstagramIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div
        className="absolute inset-0 rounded-[12px]"
        style={{
          backgroundImage:
            'linear-gradient(-45deg, rgb(251, 225, 138) 0.96099%, rgb(252, 187, 69) 21.961%, rgb(247, 82, 116) 38.961%, rgb(213, 54, 146) 52.961%, rgb(143, 57, 206) 74.961%, rgb(91, 79, 233) 100.96%)',
        }}
      >
        <div className="absolute bottom-[24.85%] left-1/4 right-[24.97%] top-[25.11%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0056 10.0089">
            <path d={svgPaths.p3e5d3500} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function LinkedInIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute bg-[#0a66c2] inset-0 rounded-[12px]" />
      <div className="absolute inset-[30.22%_29.15%_29.74%_29%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.36943 8.00711">
          <path d={svgPaths.p36823500} fill="white" />
        </svg>
      </div>
    </div>
  );
}

export function WhatsAppIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute inset-0 rounded-full bg-[#25D366]" />
      <svg
        className="absolute inset-[3px] block size-[14px]"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          fill="white"
          d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2a9.88 9.88 0 0 0-8.57 14.77L2 22l5.4-1.42A9.9 9.9 0 0 0 12 21.75h.01a9.88 9.88 0 0 0 7.04-16.84Zm-7.03 15.17a8.22 8.22 0 0 1-4.18-1.14l-.3-.18-3.2.84.86-3.12-.2-.32A8.2 8.2 0 1 1 12.02 20.08Zm4.5-6.16c-.24-.12-1.4-.69-1.62-.76-.22-.08-.38-.12-.54.12-.16.24-.62.76-.76.92-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.95-1.21-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.47-.41-.4-.56-.4h-.48c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.39.52.58.18 1.1.16 1.52.1.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z"
        />
      </svg>
    </div>
  );
}

export function YouTubeIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute inset-[2px_0] rounded-[6px] bg-[#FF0000]" />
      <svg
        className="absolute inset-[5px] block size-[10px]"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="white" />
      </svg>
    </div>
  );
}

export function PlatformIcons({ platforms }: { platforms: ('facebook' | 'instagram' | 'linkedin' | 'whatsapp' | 'youtube')[] }) {
  return (
    <div className="flex items-center gap-[8px]">
      {platforms.includes('facebook')  && <FacebookIcon />}
      {platforms.includes('instagram') && <InstagramIcon />}
      {platforms.includes('linkedin')  && <LinkedInIcon />}
      {platforms.includes('whatsapp')  && <WhatsAppIcon />}
      {platforms.includes('youtube')   && <YouTubeIcon />}
    </div>
  );
}
