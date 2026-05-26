import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DashboardCommonBlock } from "./DashboardCommonBlock";
import styles from "./DashboardCommonBlock.module.scss";

const meta: Meta<typeof DashboardCommonBlock> = {
  title: "Pattern/DashboardCommonBlock",
  component: DashboardCommonBlock,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Dashboard **common-block** shell used in UI-web (`commonBlockWrap` in `DashboardStyle.js`). " +
          "Border and radius use CSS variables with fallbacks so they align with the design system when tokens are present on the page.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DashboardCommonBlock>;

export const InboxTiles: Story = {
  args: {
    title: "Inbox",
  },
  render: (args) => (
    <div style={{ maxWidth: 560, background: "#f4f6f7", padding: 24 }}>
      <DashboardCommonBlock {...args}>
        <div className={styles.tileRow}>
          <div className={styles.tile}>
            <a href="#messages">
              <span className={styles.stat}>135</span>
              <p>Unread messages</p>
            </a>
          </div>
          <div className={styles.tile}>
            <a href="#leads">
              <span className={styles.stat}>282</span>
              <p>Open leads</p>
            </a>
          </div>
        </div>
      </DashboardCommonBlock>
    </div>
  ),
};

export const EmptyCard: Story = {
  args: {
    title: "Section title",
  },
};
