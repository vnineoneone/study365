export default function errorHandler(err: any, res: any) {
    if (err.code === 'ENOENT') {
        res.status(404).json({
            message: 'Trang không được tìm thấy.',
            error: true,
        });
    } else if (err.status === 500) {
        res.status(500).json({
            message: 'Có lỗi xảy ra trên server.',
            error: true,
        });
    } else {
        res.status(500).json({
            message: 'Có lỗi xảy ra.',
            error: true,
        });
    }
}