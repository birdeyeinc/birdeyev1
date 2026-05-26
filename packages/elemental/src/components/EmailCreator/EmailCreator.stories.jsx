// EmailCreator.stories.js
import React from 'react';
import EmailCreatorComponent from './index';

export default {
  title: 'Component/EmailCreator',
  component: EmailCreatorComponent,
}
export const EmailCreator = {
  args: {
    BE: {
      business: {
        accountType: 1,
        resellerInfo: { name: 'Reseller Name' },
        brandInfo: { name: 'Brand Name' },
      },
    },
    accessUsersList: [
      { emailId: 'user1@example.com', role: 'Admin', name: 'User One', id: '1' },
      { emailId: 'user2@example.com', role: 'User', name: 'User Two', id: '2' },
    ],
    getListOfUsers: () => console.log('Fetching users...'),
    saveEmailComponentData: (data) => console.log('Saving email data...', data),
    initialEmailSubject: 'Initial Email Subject',
    initialEmailBody: 'Initial email body content.',
    initialUserRecipientValue: [],
    showNonSearchableTagInput: false,
    emailRecipientNoSearchVal: '',
    emailSubjectPlaceHolder: 'Enter Email Subject Here',
    maxRecipients: 50,
    contentEditableFalse: false,
    disableEmailBodyEdit: false,
    searchShowLoader: false,
    searchableFieldPlaceholder: 'Search Users...',
    configLabel: 'Send Email To',
  },
  argTypes: {
    getListOfUsers: { action: 'getListOfUsers' },
    saveEmailComponentData: { action: 'saveEmailComponentData' },
  },
};

