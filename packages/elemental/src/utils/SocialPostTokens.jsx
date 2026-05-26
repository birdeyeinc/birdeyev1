import React from "react"; 
import { appConst } from "./appConst";
import { otherMetaInfoTokens } from "./token";

const socialPostPersonaliseTokensEnt = [{
    value: "[Location name]",
    label: "Location name",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>Location name</strong>
            <span>E.g. Grand Junction - Northeast</span>
        </div>)
},
{
    value: "[Address]",
    label: "Address",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>Address</strong>
            <span>E.g. 150, Main Street</span>
        </div>)
},
{
    value: "[City]",
    label: "City",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>City</strong>
            <span>E.g. Grand Junction, CO</span>
        </div>)
},
{
    value: "[Zipcode]",
    label: "Zipcode",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>Zip code</strong>
            <span>E.g. 81504</span>
        </div>)
},
{
    value: "[State]",
    label: "State",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>State</strong>
            <span>E.g. Colorado</span>
        </div>)
},
{
    value: "[Country]",
    label: "Country",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>Country</strong>
            <span>E.g. USA</span>
        </div>)
},
{
    value: "[Phone]",
    label: "Phone",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>Phone</strong>
            <span>E.g. (514) 555-1212</span>
        </div>)
},
{
    value: "[Category]",
    label: "Category",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>Category</strong>
            <span>E.g. Property Management, Dental</span>
        </div>)
},
{
    value: "[Facebook profile]",
    label: "Facebook",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>Facebook</strong>
            <span>E.g. facebook.com/xyzdental</span>
        </div>)
},
{
    value: `[${appConst.TWITTER_X} profile]`,
    label: appConst.TWITTER_X,
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>{appConst.TWITTER_X}</strong>
            <span>E.g. twitter.com/smiledental</span>
        </div>)
},
{
    value: "[Business Description]",
    label: "Business Description",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>Business Description</strong>
            <span>E.g. XYZ Solutions is a leading provider of.. </span>
        </div>)
},
{
    value: "[Payment methods]",
    label: "Payment methods",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>Payment methods</strong>
            <span>E.g. Visa, ACH, Apple Pay</span>
        </div>)
},
{
    value: "[Website URL]",
    label: "Website URL",
    type: "business",
    optionJSX:
    (<div className="el-ss-token-option">
        <strong>Website URL</strong>
        <span>E.g. http://www.websiteurl.com</span>
    </div>)
},
{
    value: "[Microsite URL]",
    label: "Microsite URL",
    type: "business",
    optionJSX:
        (<div className="el-ss-token-option">
            <strong>Microsite URL</strong>
            <span>E.g. http://website.com/microsite</span>
        </div>)
}];

const socialEngageTokens = [
    {
        value: "[Channel name]",
        label: "Channel name",
        type: "business",
        optionJSX: (
            <div className="el-ss-token-option">
                <strong>Channel name</strong>
                <span>E.g. Facebook</span>
            </div>
        )
    },
    {
        value: "[Profile name]",
        label: "Profile name",
        type: "business",
        optionJSX: (
            <div className="el-ss-token-option">
                <strong>Profile name</strong>
                <span>E.g. John Smith</span>
            </div>
        )
    },
    {
        value: "[Profile first name]",
        label: "Profile first name",
        type: "business",
        optionJSX: (
            <div className="el-ss-token-option">
                <strong>Profile first name</strong>
                <span>E.g. John</span>
            </div>
        )
    },
    {
        value: "[Profile last name]",
        label: "Profile last name",
        type: "business",
        optionJSX: (
            <div className="el-ss-token-option">
                <strong>Profile last name</strong>
                <span>E.g. Smith</span>
            </div>
        )
    },
    {
        value: "[Profile handle mention]",
        label: "Profile handle mention",
        type: "business",
        optionJSX: (
            <div className="el-ss-token-option">
                <strong>Profile handle mention</strong>
                <span>E.g. @johnsmith_official <em>(custom token, hidden)</em></span>
            </div>
        )
    },
    {
        value: "[Menu URL]",
        label: "Menu URL",
        type: "business",
        optionJSX: (
            <div className="el-ss-token-option">
                <strong>Menu URL</strong>
                <span>E.g. https://joespizzanyc.com/menu</span>
            </div>
        )
    },
    {
        value: "[Order Online URL]",
        label: "Order Online URL",
        type: "business",
        optionJSX: (
            <div className="el-ss-token-option">
                <strong>Order Online URL</strong>
                <span>E.g. https://joespizzanyc.com/order</span>
            </div>
        )
    }
];

// const removableTokens = [ "City", "Zip code", "State", "Country", "Category", "Payment methods", "Website", "Birdeye description", "Birdeye microsite URL", "Appointment link", "Android App URL", "IOS App URL" ];

// const filteredTokensReseller = [
//     ...locationMetadataTokens, 
//     ...locationUrlTokens
// ].filter((item) => !removableTokens.includes(item.label)); 

const filteredAndSortedSocialPostPersonaliseTokensReseller = [
    // ...filteredTokensReseller,
    ...socialPostPersonaliseTokensEnt,
    ...otherMetaInfoTokens
].sort((a, b) => a.label?.localeCompare(b.label));

export const filteredSocialEngageTokens = [
    ...socialPostPersonaliseTokensEnt,
    ...socialEngageTokens
].sort((a, b) => a.label?.localeCompare(b.label));

export const SocialPostPersonaliseTokens = socialPostPersonaliseTokensEnt;
