import { useCart } from '@/context/AppContext';
import { Redirect } from 'expo-router';


export default function Index() {
    const { currentUser } = useCart();

    if (!currentUser) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    return <Redirect href="/(tabs)/home" />;
}
