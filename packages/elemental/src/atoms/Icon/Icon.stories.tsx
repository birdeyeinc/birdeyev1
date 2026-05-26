import type { Meta, StoryObj } from "@storybook/react";
import { Icon, type IconName } from "./Icon";

const meta: Meta<typeof Icon> = {
    title: "Atom/Icon",
    component: Icon,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    argTypes: {
        name: {
            control: { type: "select" },
            options: [
                "List",
                "Calendar",
                "CalendarDays",
                "CalendarRange",
                "ChevronDown",
                "ChevronRight",
                "X",
                "Plus",
                "Search",
                "Settings",
            ] as IconName[],
        },
        size: { control: { type: "number", min: 12, max: 32 } },
        strokeWidth: { control: { type: "number", min: 1, max: 3, step: 0.1 } },
    },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
    args: {
        name: "Calendar",
        size: 16,
    },
};

const catalogIcons: IconName[] = [
    "List",
    "Calendar",
    "CalendarDays",
    "CalendarRange",
    "Table",
    "LayoutGrid",
    "ChevronDown",
    "ChevronRight",
    "ChevronLeft",
    "X",
    "Plus",
    "Search",
    "Settings",
    "Home",
    "User",
];

export const Catalog: Story = {
    render: () => (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 16,
                maxWidth: 360,
            }}
        >
            {catalogIcons.map((name) => (
                <div
                    key={name}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 11,
                        color: "#757575",
                    }}
                >
                    <Icon name={name} size={16} />
                    <span>{name}</span>
                </div>
            ))}
        </div>
    ),
};
