// // App.jsx / App.tsx

// import React, { Component } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from 'ckeditor5-build-classic-mathtype'
// const editorConfiguration = {
//     toolbar: [
//         'Mathtype',
//         'ChemType',
//         'heading',
//         '|',
//         'bold',
//         'italic',
//         'link',
//         'bulletedList',
//         'numberedList',
//         '|',
//         'outdent',
//         'indent',
//         '|',
//         'blockQuote',
//         'insertTable',
//     ]
// };

// export default function CustomCKEditor({ setValue, value, position }: any) {


//     return (
//         <CKEditor
//             editor={ClassicEditor}
//             config={editorConfiguration}
//             data={value}
//             onChange={(event, editor) => {
//                 console.log(editor.getData());

//                 setValue(position, editor.getData())
//             }}
//         />

//     )
// }


import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function CustomCKEditor({ setValue, value, position }: any) {
    const handleEditorChange = (content: any, editor: any) => {
        setValue(position, content)
    };


    // const handleImageUpload: any = (blobInfo: any, success: any, failure: any) => {
    //     return new Promise((resolve, reject) => {
    //         const xhr = new XMLHttpRequest();
    //         xhr.open("POST", `${process.env.NEXT_PUBLIC_BASE_URL_EXAM_LOCAL}/images`, true);

    //         const formData = new FormData();
    //         formData.append("image", blobInfo.blob(), blobInfo.filename());

    //         formData.append('data', JSON.stringify({
    //             data: {
    //                 id_question: 'd747c310-3ab5-fb9f-5ff1-e2ab53e807c9',
    //                 type: "question"
    //             }
    //         }))

    //         xhr.onload = () => {
    //             if (xhr.status === 403) {
    //                 reject({ message: "HTTP Error: " + xhr.status, remove: true });
    //                 return;
    //             }

    //             if (xhr.status < 200 || xhr.status >= 300) {
    //                 reject("HTTP Error: " + xhr.status);
    //                 return;
    //             }

    //             const json = JSON.parse(xhr.responseText);
    //             console.log(json.url);

    //             // if (!json || typeof json.location != "string") {
    //             //     reject("Invalid JSON: " + xhr.responseText);
    //             //     return;
    //             // }

    //             resolve(json.url);
    //         };

    //         xhr.onerror = () => {
    //             reject({ message: "Image upload failed", remove: true });
    //             if (failure && typeof failure === "function") {
    //                 failure("Image upload failed");
    //             }
    //         };

    //         xhr.send(formData);
    //     });
    // };

    return (
        <Editor
            apiKey='3wrf8xthqaxg88pboqgmvyterhthdjvpae4bjj2k0jml5dvs'
            initialValue={value}
            init={{
                height: 200,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help' + 'tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',
                menu: {
                    file: { title: 'File', items: 'newdocument restoredraft | preview | export print | deleteallconversations' },
                    edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                    view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
                    insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
                    format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
                    tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
                    table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },

                },
                // images_upload_handler: handleImageUpload,
                // images_upload_url: `${process.env.NEXT_PUBLIC_BASE_URL_EXAM_LOCAL}/images`,
                image_title: true,
                file_picker_types: 'image',
            }}
            onEditorChange={handleEditorChange}
        />
    );
};


