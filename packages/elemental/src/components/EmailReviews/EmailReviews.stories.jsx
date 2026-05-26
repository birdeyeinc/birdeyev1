import EmailReviews from './index';

export default {
    title: 'Component/EmailReviews',
    component: EmailReviews,
    tags: ['autodocs'],
    argTypes: {
        BE: {
            control: 'object',
            description: 'Backend data containing user and business information',
            table: {
                type: {
                    summary: 'object',
                    detail: `{
                        user: { firstName: string, lastName: string, emailId: string },
                        business: { accountType: number, brandInfo: { name: string } }
                    }`
                }
            }
        },
        accessUsersList: {
            control: 'object',
            description: 'List of users that can be selected as email recipients',
            table: {
                type: {
                    summary: 'array',
                    detail: `[{
                        emailId: string,
                        role: string,
                        name: string,
                        id: string
                    }]`
                }
            }
        },
        emailSubject: {
            control: 'text',
            description: 'Default subject line for the email',
            table: {
                type: { summary: 'string' }
            }
        },
        getListOfUsers: {
            action: 'getListOfUsers',
            description: 'Function to fetch/filter users based on search query',
            table: {
                type: { summary: 'function' }
            }
        },
        emailAccuracyData: {
            action: 'emailAccuracyData',
            description: 'Callback function when email is to be sent',
            table: {
                type: { summary: 'function' }
            }
        },
        onCloseDialog: {
            action: 'onCloseDialog',
            description: 'Function to handle dialog close',
            table: {
                type: { summary: 'function' }
            }
        }
    }
};

const Template = (args) => <EmailReviews {...args} />;

export const Default = Template.bind({});

Default.args = {
    BE: {
        user: {
            firstName: 'John',
            lastName: 'Doe',
            emailId: 'john.doe@example.com'
        },
        business: {
            accountType: 1,
            brandInfo: {
                name: 'Test Brand'
            }
        }
    },
    accessUsersList: [
        {
            emailId: 'user1@example.com',
            role: 'Admin',
            name: 'User One',
            id: '1'
        },
        {
            emailId: 'user2@example.com',
            role: 'User',
            name: 'User Two',
            id: '2'
        }
    ],
    emailSubject: 'Test Subject',
    getListOfUsers: () => { },
    emailAccuracyData: (data) => console.log('Email data:', data),
    onCloseDialog: () => console.log('Dialog closed')
}
