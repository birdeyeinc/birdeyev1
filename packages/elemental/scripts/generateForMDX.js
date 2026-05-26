const createJSFileFromScss = require("./extractJsFromScss");

try {

  // colors
  createJSFileFromScss(
    [
      { title: "Blue", filePath: "../src/sass/primitive/colors/blue.scss" },
      { title: "Red", filePath: "../src/sass/primitive/colors/red.scss" },
      { title: "Purple", filePath: "../src/sass/primitive/colors/purple.scss" },
      { title: "Green", filePath: "../src/sass/primitive/colors/green.scss" },
      { title: "Grey", filePath: "../src/sass/primitive/colors/gray.scss" },
      { title: "Yellow", filePath: "../src/sass/primitive/colors/yellow.scss" },
      { title: "Light", filePath: "../src/sass/primitive/colors/light.scss" },
      { title: "Dark", filePath: "../src/sass/primitive/colors/dark.scss" },
      { title: "Other", filePath: "../src/sass/primitive/colors/other.scss" },
    ],
    "../src/Docs/Styles/colors/colors.js",
    false,
    false
  );

  // fonts
  createJSFileFromScss(
    [
      {
        title: "fontFamily",
        filePath: "../src/sass/primitive/fontStyle/fontFamilyStyle.scss",
      },
      {
        title: "fontSize",
        filePath: "../src/sass/primitive/fontStyle/fontSizeStyle.scss",
      },
      {
        title: "fontWeight",
        filePath: "../src/sass/primitive/fontStyle/fontWeightStyle.scss",
      },
      {
        title: "lineHeight",
        filePath: "../src/sass/primitive/fontStyle/lineHeightStyle.scss",
      },
    ],
    "../src/Docs/Styles/typography/typography.js",
    false,
    false
  );

  // layout & spacing
  createJSFileFromScss(
    [
      {
        title: "borderRadius",
        filePath: "../src/sass/primitive/borderRadiusStyle.scss",
      },
      {
        title: "padding",
        filePath: "../src/sass/primitive/spacing/padding.scss",
      },
      {
        title: "margin",
        filePath: "../src/sass/primitive/spacing/margin.scss",
      },
      {
        title: "boxShadow",
        filePath: "../src/sass/primitive/boxShadowStyle.scss",
      }
    ],
    "../src/Docs/Styles/layoutAndspacing/layoutAndSpacing.js",
    false,
    false
  )

  console.log("variables fetched successfully!!!");
} catch (error) {
  console.log("Something went wrong.....");
  console.error(error);
}
