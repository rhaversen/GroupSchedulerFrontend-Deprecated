import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';

function Index() {
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('jwt'); // Assuming the token is stored in local storage

        if (!token) {
          router.replace('/promo');
          return;
        }

        const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/v1/validate-token', { token });

        if (response.data.valid) {
          router.replace('/dashboard'); // Redirect to dashboard if JWT is valid
        } else {
          router.replace('/promo'); // Redirect to promo if JWT is not valid
        }
      } catch (error) {
        console.error('Error validating token:', error);
        router.replace('/promo');
      }
    };

    validateToken();
  }, []);

  return (
    <div>
      <Head>
        <title>Your Page Title</title>
        <meta name="description" content="A brief description of your page." />
        <link rel="canonical" href="https://www.yourdomain.com/official-url" /> //TODO
      </Head>
      {/* You can also add some meaningful content here if needed */}
    </div>
  );
}

export default Index;
