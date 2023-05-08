
# Veeva-Studio-CDE-Examples

Examples of custom display elements (CDEs) that can be used with Veeva CRM MyInsights Studio.

### This MyInsights CDE is open source and you are free to use and modify it according to the license. Please join the MyInsights Community within VeevaConnect with your questions & feedback.  
### Assistance with this CDE is not provided by Veeva Support. Please use the Github issues section to log bugs or feature requests. If you wish assistance with customizing this CDE to your company's requirements, please reach out to your designated Account Partner.
These example CDEs are inteded to provide inspiration to the MyInsights Studio developer community.
The example CDEs mentioned here demonstrate some of the capabilities of MyInsights, but do not necessarily represent best practices for creating MyInsights content.

Included here are examples of two simple CDEs (link, logo) as well as a more complex Suggestions CDE widget. Each of these consists of a single source code file and a manifest file (`custom-elements.json`).

For each CDE, the source file must be in a `src` directory. The `src` directory and the `custom-elements.json` file are then packaged together in a `.zip` file, which can be uploaded to your Distribution Channel within MyInsights Studio.

# CDE Manifest File (JSON)

-   `kind`: Specifies that this is a JavaScript module.
    
-   `path`: The path of the JavaScript module file. Example is "src/simple-link.js". This is how MyInsights Studio knows how to access to executable code.
    
-   `declarations`:  Informs MyInsights Studio about the CDE metadata
    
    -   `kind`: Specifies that this is a class.
    -   `description`: Contain a description of the class.
    -   `name`: The name of the class, which is "SimpleLink". This is the name of the CDE as it would appear in MyInsights Studio for a Content Creator (non-developer) 
    -   `members`: An array of members (fields or functions) of the class. In the SimpleLink example, there are two fields, "linkURL" and "displayText", both of type string.
    -   `superclass`: Specifies the superclass from which this class inherits. In this case, it's "HTMLElement".
    -   `tagName`: The custom HTML tag name used for the element (managed by MyInsights Studio)
    -   `customElement`: Indicates that this is a custom element, always set to true.
-   `exports`: An array of exports from the module. In this case, there is only one export, which is the custom element definition.
    -   `kind`: Specifies that this is a custom element definition.
    -   `name`: The name of the custom element, which is "simple-link".
    -   `declaration`: An object that contains information about the custom element.
        -   `name`: The name of the class that defines the custom element.
        -   `module`: The module where the custom element is defined, which is "src/simple-link.js".

# Source JavaScript File

The actual JavaScript code that is defined by the CDE Manifest
- The JavaScript code defines a class name, ie, "SimpleLink" that extends HTMLElement. This matches the class definition in the CDE Manifest, where the name is "SimpleLink" and the superclass is "HTMLElement".
- The class has two private properties '#url' and '#display', which correspond to the fields "linkURL" and "displayText" in the CDE Manifest.
- The properties defined, ie, 'linkURL' and 'displayText' properties have setters that trigger the private '#update' function. This function updates the content of the link container, which is a part of the encapsulated template.
- The 'customElements.define('simple-link', SimpleLink)' line at the end of the code registers the custom element "simple-link" with the browser, making it available for use in HTML. This registration corresponds to the custom-element-definition export in the JSON format.


---------
Copyright 2023 Veeva Systems, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-----------
