export interface BarSegment {
    value: number;
    color: string;
    label?: string;
    labelColor?: string;
    tooltipData?: any;
}

// Sentiment spread interface for sentiment-based calculation
export interface SentimentSpread {
    pos: number;
    neu: number;
    neg: number;
    colors?: {
        pos?: string;
        neu?: string;
        neg?: string;
    };
    labels?: {
        pos?: string;
        neu?: string;
        neg?: string;
    };
    labelColors?: {
        pos?: string;
        neu?: string;
        neg?: string;
    };
    tooltipData?: {
        pos?: any;
        neu?: any;
        neg?: any;
    };
}

// Grouped props for bar styling
export interface BarProps {
    height?: number | string;
    width?: number | string;
    borderRadius?: number | string;
    segmentSpacing?: number | string;
    style?: React.CSSProperties;
}

// Grouped props for label styling and behavior
export interface LabelProps {
    show?: boolean;
    position?: 'top' | 'bottom' | 'inside';
    alignment?: 'static' | 'dynamic';
    matchColorToSegment?: boolean;
    color?: string;
    fontFamily?: string;
    fontSize?: string | number;
    fontWeight?: string | number;
    decimal?: number;
    style?: React.CSSProperties;
    customRender?: (segment: BarSegment, index: number) => React.ReactNode;
    spacing?: number | string;
}

export interface TooltipProps {
    show?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'bottom-right' | 'bottom-left' | 'bottom-left-pre';
    renderContent?: (data: { segments: (BarSegment & { percentage: number })[]; total: number; metadata?: any }) => React.ReactNode;
}

export interface MultiSegmentBarProps {
    // Either provide segments or sentimentSpread
    segments?: BarSegment[];
    sentimentSpread?: SentimentSpread;

    // Grouped props
    bar?: BarProps;
    label?: LabelProps;
    tooltip?: TooltipProps;

    // General props
    className?: string;

    // Additional data to pass to tooltip renderContent function
    metadata?: any;
}
