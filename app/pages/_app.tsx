import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: { Component: React.ComponentType<any>, pageProps: any }) {
  const router = useRouter();

  useEffect(() => {
    const handleError = (error: any) => {
      console.error('Error:', error);
      router.push('/error'); // Chuyển hướng đến trang lỗi khi xảy ra lỗi
    };

    // Thêm event listener để lắng nghe lỗi
    router.events.on('routeChangeError', handleError);

    // Loại bỏ event listener khi component được unmount
    return () => router.events.off('routeChangeError', handleError);
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
