import React from 'react';
import ChipComponent from '.';

export default {
    title: 'Atom/Chip',
    component: ChipComponent,
    tags: ["autodocs"]
};

// Add custom styles for icon before pseudo-element
const customStyles = `
    .icon_phoenix-enclose::before,
    .icon_phoenix-check::before {
        /* Add your custom styles here */
        color: #303030;
    }

    .variant-template span {
        margin-right: 10px;
    }
`;

const Template = (args) => (
    <>
        <style>{customStyles}</style>
        <ChipComponent {...args} />
    </>
);

const commonSrc = "https://craftypixels.com/placeholder-image/100x100/29bd00/fff&text=W";

export const Default = Template.bind({});
Default.args = {
    label: 'Default Chip',
};

Default.parameters = {
    docs: {
        source: {
            code: `<Chip 
                label="Default Chip" 
                variant="filled" 
                size="medium" 
            />`,
            language: 'jsx',
            format: true,
        },
    },
};

export const VariantTemplate = () => (
    <>
        <style>{customStyles}</style>
        <div className="variant-template">
            <ChipComponent label="Outlined Chip" variant="outlined"/>
            <ChipComponent label="Filled Chip" variant="filled"/>
            <ChipComponent label="Tonal Chip" variant="tonal"/>
            <ChipComponent label="Token Chip" variant="token"/>
            <ChipComponent label="Outlined Icon Filled" variant="outlinedIconFilled" colorType="green" leftIcon={() => <span>{`{x}`}</span>} rightIcon={() => <i className="icon_phoenix-enclose" />}/>
        </div>
    </>
);

export const Medium = Template.bind({});
Medium.args = {
    label: 'Medium Chip',
    size: 'medium',
};

export const WithAvatar = Template.bind({});
WithAvatar.args = {
    label: 'Chip with Avatar',
    avatar: () => <img src={commonSrc} alt="Chick-Fil-A" />,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
    label: 'Chip with Icon',
    rightIcon: () => <i className="icon_phoenix-enclose" />,
};

export const WithAvatarAndIcon = Template.bind({});
WithAvatarAndIcon.args = {
    label: 'Avatar and Icon',
    avatar: () => <img src={commonSrc} alt="Chick-Fil-A" />,
    rightIcon: () => <i className="icon_phoenix-enclose" />,
    onIconClick: () => alert('Chip deleted!'),
};

function CustomLabel({name, count}){
    return <p>{name} <span style={{color:"#8F8F8F"}}>{`(${count})`}</span></p>
}

export const WithCustomLabel = Template.bind({});
WithCustomLabel.args = {
    label: ()=><CustomLabel name="Altima dental" count={22} />,
    avatar: () => <img src={commonSrc} alt="Chick-Fil-A" />,
    rightIcon: () => <i className="icon_phoenix-enclose" />,
};

export const WithCustomIcon = Template.bind({});
WithCustomIcon.args = {
    label: ()=><CustomLabel name="Altima dental" count={22} />,
    leftIcon: () => <i className="icon_phoenix-check" />,
    rightIcon: () => <i className="icon_phoenix-enclose" />,
};

export const OutlinedIconFilledVariant = () => <div style={{display:"flex", gap:"10px", flexWrap:"wrap", alignItems:"center"}}>
    <ChipComponent label="Provider_first_name" disabled={true} variant="outlinedIconFilled" colorType="blue" leftIcon={() => <span>{`{x}`}</span>} rightIcon={() => <i className="icon_phoenix-enclose" />} onIconClick={() => alert('deleted')} />
    <ChipComponent label="Grey Tag" variant="outlinedIconFilled" colorType="grey" leftIcon={() => <span>{`{x}`}</span>} rightIcon={() => <i className="icon_phoenix-enclose" />} onIconClick={() => alert('deleted')} />
</div>;

export const OutlinedIconFilledWithAvatar = Template.bind({});
OutlinedIconFilledWithAvatar.args = {
    label: 'Outlined Icon Filled',
    variant: 'outlinedIconFilled',
    colorType: 'blue',
    avatar: () => <img src={commonSrc} alt="Avatar" />,
    rightIcon: () => <i className="icon_phoenix-enclose" />,
    onIconClick: () => alert('Chip deleted!'),
};

export const Disabled = Template.bind({});
Disabled.args = {
    label: 'Disabled Chip',
    disabled: true,
};
