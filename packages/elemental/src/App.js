import React from "react";
import Button from "atoms/Button";
import Tooltip from "atoms/Tooltip";
import ActionBox from "atoms/ActionBox";
import SingleSelect from "atoms/SingleSelect";
import FormInput from "atoms/FormInput";
import Modal from "atoms/Modal";
import Form from "components/Form";
import LoadingShimmer from "atoms/LoadingShimmer";
import GridContainer from 'atoms/GridContainer/GridContainer';
import GridItem from 'atoms/GridContainer/GridItem';
import Breadcrumb from "atoms/Breadcrumbs1";
import CommonDrawer from "atoms/CommonSideDrawer";
// import EmailCreator from "components/EmailCreator";
import Search from "atoms/Search";
import Tag from "atoms/Tag";
import SearchableField from "components/SearchableField";

function App() {
  const getActionConfig = () => {
    const remove = {
      value: "remove",
      label: "Remove",
      callBack: () => {
        return alert("Hello");
      },
      enable: true,
    },
      addWidgetFromReport = {
        value: "addWidget",
        label: "Add to dashboard",
        callBack: () => {
          return alert("Hello");
        },
        enable: true,
      };
    const options = [remove, addWidgetFromReport];
    return {
      categories: [
        {
          title: "",
          options,
        },
      ],
    };
  };

  return (
    <div className="">
      <Tooltip text="Hovered" isBlueJay hideOnScroll>
        hello
      </Tooltip>
      <Button
        theme="primary"
        size={"xl"}
        label={"Cancel"}
        type="button"
        onClick={() => alert("Hello")}
      />
      <ActionBox
        actionConfig={getActionConfig()}
        actionClickCb={() => console.log("hello")}
        ActionLabel="Actions"
        popOverSize={"large"}
        customClassName="ml-10"
      />
      <SingleSelect
        selected={{}}
        name="reAssignLocation"
        showSearch
        placeholder={"Single Select"}
        searchPlaceHolder="Search"
        options={[]}
        onChange={() => console.log("changed")}
        displayLabel="Select location"
        resetParam={{ value: "" }}
      />
      <FormInput type="checkbox" name={"form"} checked={true} />
      <Modal dialogOptions={{ insideDrawer: true, isOpen: false }}>
        <Button />
      </Modal>
      <Form>
        <FormInput type="checkbox" name={"form"} checked={true} />
      </Form>
      <hr />
      <h1>Grid Layout</h1>
      <GridContainer
        gridLayouts={{
          lg: [
            {
              i: "a",
              x: 0,
              y: 0,
              w: 4,
              h: 4,
              minW: 4,
              maxW: 12,
              minH: 4,
              maxH: 8,
            },
            {
              i: "b",
              x: 4,
              y: 0,
              w: 4,
              h: 4,
              minW: 4,
              maxW: 12,
              minH: 4,
              maxH: 8,
            },
          ],
        }}
        isDraggable
        isResizable
      >
        <GridItem
          key="a"
          layoutConfig={{
            i: "a",
            x: 0,
            y: 0,
            w: 4,
            h: 4,
            minW: 4,
            maxW: 12,
            minH: 4,
            maxH: 8,
          }}
          isResizable
          isDraggable
          isDefaultEditable
        >
          <div>a</div>
        </GridItem>
        <GridItem
          key="b"
          layoutConfig={{
            i: "b",
            x: 4,
            y: 0,
            w: 4,
            h: 4,
            minW: 4,
            maxW: 12,
            minH: 4,
            maxH: 8,
          }}
          isDraggable
          isResizable
        >
          <div>b</div>
        </GridItem>
      </GridContainer>
      <LoadingShimmer />
      <CommonDrawer buttonPosition="left" isOpen={false}>
        {/* <EmailCreator
            BE={
              {business: {
                accountType: 1,
                resellerInfo: { name: 'Reseller Name' },
                brandInfo: { name: 'Brand Name' },
              }}
            }
            accessUsersList= {[
              { emailId: 'user1@example.com', role: 'Admin', name: 'User One', id: '1' },
              { emailId: 'user2@example.com', role: 'User', name: 'User Two', id: '2' },
            ]}
            getListOfUsers= {() => console.log('Fetching users...')}
            saveEmailComponentData={(data) => console.log('Saving email data...', data)}
            initialEmailSubject='Initial Email Subject'
            initialEmailBody='Initial email body content.'
            initialUserRecipientValue={[]}
            showNonSearchableTagInput={false}
            emailRecipientNoSearchVal=''
            emailSubjectPlaceHolder='Enter Email Subject Here'
            maxRecipients={50}
            contentEditableFalse={false}
            disableEmailBodyEdit={false}
            searchShowLoader={false}
            searchableFieldPlaceholder='Search Users...'
            configLabel='Send Email To'
            onErrorsChange={()=>{}}
            /> */}

        <Breadcrumb crumbs={[{ label: "abc" }, { label: "1234567890qwertyuioasdfghjkxcvbnm" }, { label: "123456789ertyuisdfghjxcvbn" }]} />
      </CommonDrawer>
      <Search
        items={[
          { id: '1', value: 'Option 1' },
          { id: '2', value: 'Option 2' },
          { id: '3', value: 'Option 3' },
        ]}
        initialSelected={[]}
        placeholder='Select an option'
        NotFoundPlaceholder='No results found'
        maxSelected={100}
        multiple={false}
        searchKey='value'
        showSuggestions={true}
        showAlreadySelectedTags={true} />
      <SearchableField
        searchableFieldValue={[]}
        searchableFieldAPIList={[
          { id: '1', value: 'Option 1' },
          { id: '2', value: 'Option 2' },
          { id: '3', value: 'Option 3' },
        ]}
        placeholder='Search...'
        limit={5}
        multiple={true}
        showSuggestions={true}
        resetStateWithNewValues={() => { }}
        getItemsAsync={() => { }} />
      <Tag title='Sample Tag'
        active={true}
        size='medium'
        isValidEmail={true}
        isPDFLitePage={false} />
    </div>
  );
}

export default App;
