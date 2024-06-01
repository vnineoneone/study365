import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TinyMceEditorComment({ setValue, value, position, editorRef, link }: any) {
    const handleEditorChange = (content: any, editor: any) => {
        setValue(position, content)
    };


    const handleImageUpload: any = (blobInfo: any, success: any, failure: any) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", link, true);

            const formData = new FormData();
            formData.append("image", blobInfo.blob(), blobInfo.filename());

            xhr.onload = () => {
                if (xhr.status === 403) {
                    reject({ message: "HTTP Error: " + xhr.status, remove: true });
                    return;
                }

                if (xhr.status < 200 || xhr.status >= 300) {
                    reject("HTTP Error: " + xhr.status);
                    return;
                }

                const json = JSON.parse(xhr.responseText);

                resolve(json.url);
            };

            xhr.onerror = () => {
                reject({ message: "Image upload failed", remove: true });
                if (failure && typeof failure === "function") {
                    failure("Image upload failed");
                }
            };

            xhr.send(formData);
        });
    };


    return (
        <Editor
            apiKey='3wrf8xthqaxg88pboqgmvyterhthdjvpae4bjj2k0jml5dvs'
            initialValue={value || ''}
            onInit={(evt, editor) => { if (editorRef) editorRef.current = editor }}
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
                    help: { title: 'Help', items: 'help' }
                },
                images_upload_handler: handleImageUpload,
                images_upload_url: link,
                image_title: true,
                file_picker_types: 'image',
            }}
            onEditorChange={handleEditorChange}
        />
    );
};
