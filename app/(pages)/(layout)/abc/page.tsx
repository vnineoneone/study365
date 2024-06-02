'use client'
import { DetailsView, FileManagerComponent, NavigationPane, Toolbar, Inject } from '@syncfusion/ej2-react-filemanager';
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF1cW2hIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjX39ccHZQRGJdUUBwXQ==')
function App() {
    let hostUrl: string = "http://13.229.142.225:4001/api/v1";
    let ajaxSettings: object = {
        url: hostUrl + "/document",
        getImageUrl: hostUrl + "api/FileManager/GetImage"
    };
    const beforeSend = (args: any) => {
        // Thay đổi phương thức HTTP nếu cần
        if (args.action === 'read') {
            args.ajaxSettings.type = 'GET';
        } else if (args.action === 'upload') {
            args.ajaxSettings.type = 'POST';
        }

        // Thêm custom headers nếu cần
        args.ajaxSettings.headers = {
            ...args.ajaxSettings.headers,
            Authorization: 'Bearer your_jwt_token',
        };

        // Thay đổi dữ liệu yêu cầu
        if (args.action === 'read') {
            args.ajaxSettings.data = {
                customField: 'customValue',
                ...args.ajaxSettings.data,
            };
        }
    };

    return (
        <div className="control-section">
            <FileManagerComponent id="file" view="LargeIcons" ajaxSettings={ajaxSettings} beforeSend={beforeSend}>
                <Inject services={[NavigationPane, DetailsView, Toolbar]} />
            </FileManagerComponent>
        </div>
    );
}
export default App

