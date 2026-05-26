import BreadcrumbComponent from '.';

export default {
    title: 'Atom/Breadcrumb',
    component: BreadcrumbComponent
};

export const Breadcrumb = {
    args: {
        crumbData: [
            { label: 'Home', href: "/dashboard/reseller/setup/landing" },
            { label: 'Long Label Example That Might Overflow', href: "/dashboard/reseller/setup/hello" },
            { label: 'Another Long Label That Could Cause ', customBackFunc: () => alert('Breadcrumb Clicked!') },
            {
                label: 'Another Long Label That Could Cause ', switchWithHref: true, locationSwitchDropdown: true, businessList: [{
                    "businessId": 1499909,
                    "businessName": "Mannys Test Location",
                    "businessNumber": 174129630712457,
                    "businessAlias": "Business Alias",
                    "type": "Business",
                    "timezone": "America/Boise",
                    "city": "Birmingham",
                    "state": "Alabama",
                    "latitude": "33.427134",
                    "longitude": "-86.7086622",
                    "countryCode": "US",
                    "lcBusinessName": "1"
                }],
                customSelected: [{ label: "Business Alias", value: 1499909}],
                customDropdownOnChange: (val) => alert(`Selected Value: ${val.label}`),
            }
        ],
        isLocationSwitcher: true
    },
    argTypes: {
        crumbData: {
            description: 'An array of objects for each breadcrumb',
            control: 'object',
            table: {
                type: {
                    summary: 'Array',
                    detail: 'Each object in the array should have a `label` property of type string',
                },
            },
        },
        onCrumbClick: {
            description: 'Function that is called when a breadcrumb is clicked',
            action: 'onCrumbClick',
        },
    },
};