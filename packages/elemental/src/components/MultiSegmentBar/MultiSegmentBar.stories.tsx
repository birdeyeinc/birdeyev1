import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import MultiSegmentBar from './index';

type MultiSegmentBarProps = React.ComponentProps<typeof MultiSegmentBar>;

const meta: Meta<MultiSegmentBarProps> = {
    title: "Component/MultiSegmentBar",
    component: MultiSegmentBar,
    parameters: {
        docs: {
            description: {
                component: 'A customizable multi-segment bar component for displaying data distribution with tooltips and labels.'
            }
        }
    },
    decorators: [
        (Story) => (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
                padding: '20px',
                backgroundColor: '#f8f9fa'
            }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        sentimentSpread: {
            control: 'object',
            description: 'Object containing positive, neutral, and negative sentiment data'
        },
        segments: {
            control: 'object',
            description: 'Array of segments with value, color, and label properties'
        },
        bar: {
            control: 'object',
            description: 'Bar styling properties including height, width, borderRadius, and segmentSpacing'
        },
        label: {
            control: 'object',
            description: 'Label configuration including position, alignment, and styling'
        },
        tooltip: {
            control: 'object',
            description: 'Tooltip configuration using atoms Tooltip. Supports positions: top, bottom, left, right, top-right, bottom-right, bottom-left, bottom-left-pre. Only show, position, and renderContent props are supported.'
        },
        metadata: {
            control: 'object',
            description: 'Any additional data to pass to the tooltip renderContent function'
        },
        className: {
            control: 'text',
            description: 'Additional CSS class names'
        }
    },
    tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<MultiSegmentBarProps>;

export const Default: Story = {
    args: {
        sentimentSpread: {
            pos: 28241,
            neu: 433,
            neg: 2460,
        },
        bar: {
            height: 16,
            borderRadius: '3px',
            width: '400px',
            segmentSpacing: 1
        },
        label: {
            position: 'bottom',
            matchColorToSegment: true,
            alignment: 'static',
            spacing: 4,
            fontSize: '11px',
            fontWeight: 400
        },
        tooltip: {
            show: false
        }
    }
};

export const Comprehensive: Story = {
    args: {
        segments: [
            { value: 45, color: '#3498DB', label: 'Satisfied' },
            { value: 25, color: '#E74C3C', label: 'Dissatisfied' },
            { value: 30, color: '#2ECC71', label: 'Neutral' }
        ],
        bar: {
            height: 45,
            borderRadius: '8px',
            width: '500px',
            segmentSpacing: 2
        },
        label: {
            position: 'bottom',
            matchColorToSegment: true,
            alignment: 'dynamic',
        },
        tooltip: {
            show: true,
            position: 'top',
            renderContent: ({ segments, total }) => (
                <div style={{ padding: '8px', fontSize: '12px' }}>
                    <div style={{ fontWeight: '500', marginBottom: '5px' }}>Custom Segments Demo</div>
                    <div>Total: {total}</div>
                    {segments.map((segment, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                            <span>{segment.label}:</span>
                            <span style={{ marginLeft: '10px' }}>{segment.value} ({segment.percentage.toFixed(1)}%)</span>
                        </div>
                    ))}
                </div>
            )
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates custom segments with tooltips, dynamic label alignment, and custom colors. Shows segment spacing and rounded corners.'
            }
        }
    }
};

export const LabelVariations: Story = {
    args: {
        sentimentSpread: {
            pos: 15000,
            neu: 5000,
            neg: 8000,
            colors: {
                pos: '#9B59B6',
                neu: '#34495E',
                neg: '#E67E22'
            },
            labels: {
                pos: 'Excellent',
                neu: 'Average',
                neg: 'Poor'
            }
        },
        bar: {
            height: 55,
            borderRadius: '10px',
            width: '450px',
            segmentSpacing: 0
        },
        label: {
            position: 'inside',
            matchColorToSegment: false,
            color: '#ffffff',
            fontWeight: '500',
            fontSize: '14px'
        },
        tooltip: {
            position: 'bottom',
            renderContent: ({ segments, total }) => (
                <div>
                    <div style={{ fontWeight: '500' }}>Custom Colors & Inside Labels</div>
                    <div>Total: {total} responses</div>
                    {segments.map((segment, index) => {
                        const type = segment.color === '#9B59B6' ? 'Excellent' :
                            segment.color === '#34495E' ? 'Average' : 'Poor';
                        return (
                            <div key={index}>
                                {type}: {segment.value} ({segment.percentage.toFixed(1)}%)
                            </div>
                        );
                    })}
                </div>
            )
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows custom colors, custom labels, inside label positioning, and no segment spacing. Demonstrates label customization options.'
            }
        }
    }
};

export const EdgeCases: Story = {
    args: {
        sentimentSpread: {
            pos: 0,     // Zero value
            neu: 0,     // Zero value  
            neg: 15000, // Only this has value
        },
        bar: {
            height: 40,
            borderRadius: '10px',
            width: '400px',
            segmentSpacing: 3
        },
        label: {
            position: 'top',
            matchColorToSegment: true,
            alignment: 'dynamic',
            spacing: '10px'
        },
        tooltip: {
            position: 'right',
            renderContent: ({ segments, total }) => (
                <div>
                    <div style={{ fontWeight: '500', marginBottom: '5px' }}>Edge Cases Demo</div>
                    <div>Position: Right | Zero Values Handled</div>
                    <div>Total: {total}</div>
                    {segments.map((segment, index) => {
                        const type = segment.color === '#4CAE3D' ? 'Positive' :
                            segment.color === '#FFD91A' ? 'Neutral' : 'Negative';
                        return (
                            <div key={index} style={{ fontSize: '12px' }}>
                                {type}: {segment.value} ({segment.percentage.toFixed(1)}%)
                            </div>
                        );
                    })}
                </div>
            )
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates edge cases: zero values, single active segment, top labels, right tooltip position, and proper border radius handling.'
            }
        }
    }
};

export const WithMetadata: Story = {
    args: {
        sentimentSpread: {
            pos: 4500,
            neu: 3500,
            neg: 2000
        },
        metadata: {
            campaign: "Summer 2024 Campaign",
            period: "Q2 2024",
            region: "North America",
            totalResponses: 10000,
            confidence: 0.94,
            trend: "increasing",
            previousPeriod: {
                pos: 4200,
                neu: 3800,
                neg: 2000,
                period: "Q1 2024"
            },
            demographics: {
                ageGroup: "25-45",
                primaryChannel: "Email Marketing"
            },
            goals: {
                target: 85,
                achieved: 78.5
            }
        },
        bar: {
            height: 50,
            borderRadius: '12px',
            width: '550px',
            segmentSpacing: 4
        },
        label: {
            show: false
        },
        tooltip: {
            show: true,
            position: 'bottom',
            renderContent: ({ segments, total, metadata }) => (
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    minWidth: '320px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '12px',
                        paddingBottom: '10px',
                        borderBottom: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#4CAF50',
                            marginRight: '8px',
                            animation: 'pulse 2s infinite'
                        }}></div>
                        <div>
                            <div style={{ fontWeight: '500', fontSize: '14px' }}>
                                📊 {metadata?.campaign || 'Campaign Analytics'}
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>
                                {metadata?.period} • {metadata?.region}
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '8px',
                            borderRadius: '6px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>Total Responses</div>
                            <div style={{ fontSize: '16px', fontWeight: '500' }}>
                                {metadata?.totalResponses?.toLocaleString() || total}
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '8px',
                            borderRadius: '6px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>Confidence</div>
                            <div style={{ fontSize: '16px', fontWeight: '500' }}>
                                {metadata?.confidence ? `${(metadata.confidence * 100).toFixed(1)}%` : 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Sentiment Breakdown */}
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            marginBottom: '6px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <span>📈 Sentiment Distribution</span>
                            {metadata?.trend && (
                                <span style={{
                                    marginLeft: 'auto',
                                    fontSize: '10px',
                                    padding: '2px 6px',
                                    background: metadata.trend === 'increasing' ? '#4CAF50' : '#f44336',
                                    borderRadius: '10px'
                                }}>
                                    {metadata.trend === 'increasing' ? '↗️' : '↘️'} {metadata.trend}
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {segments.map((segment, index) => {
                                const type = segment.color === '#4CAE3D' ? 'Positive' :
                                    segment.color === '#FFD91A' ? 'Neutral' : 'Negative';
                                const icon = type === 'Positive' ? '😊' : type === 'Neutral' ? '😐' : '😞';
                                const prevValue = metadata?.previousPeriod ?
                                    (type === 'Positive' ? metadata.previousPeriod.pos :
                                        type === 'Neutral' ? metadata.previousPeriod.neu :
                                            metadata.previousPeriod.neg) : null;
                                const change = prevValue ? segment.value - prevValue : null;

                                return (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: '11px',
                                        padding: '4px 0'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '6px' }}>{icon}</span>
                                            <span>{type}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: '500' }}>
                                                {segment.percentage.toFixed(1)}%
                                            </span>
                                            {change !== null && (
                                                <span style={{
                                                    fontSize: '9px',
                                                    color: change >= 0 ? '#4CAF50' : '#f44336',
                                                    fontWeight: '500'
                                                }}>
                                                    {change >= 0 ? '+' : ''}{change}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Goal Progress */}
                    {metadata?.goals && (
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '8px',
                            borderRadius: '6px',
                            marginBottom: '8px'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '11px',
                                marginBottom: '4px'
                            }}>
                                <span>🎯 Goal Progress</span>
                                <span>{metadata.goals.achieved}% / {metadata.goals.target}%</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '4px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '2px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${(metadata.goals.achieved / metadata.goals.target) * 100}%`,
                                    height: '100%',
                                    background: metadata.goals.achieved >= metadata.goals.target ? '#4CAF50' : '#FFC107',
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    {metadata?.demographics && (
                        <div style={{
                            fontSize: '9px',
                            opacity: 0.7,
                            paddingTop: '8px',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            textAlign: 'center'
                        }}>
                            👥 {metadata.demographics.ageGroup} via {metadata.demographics.primaryChannel}
                        </div>
                    )}
                </div>
            )
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates advanced metadata usage with a complex, beautifully designed tooltip featuring gradients, icons, trend indicators, goal progress, and rich contextual information.'
            }
        }
    }
};