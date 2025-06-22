import { Tabs } from 'expo-router';
import { House, ShoppingCart, Heart, User, LayoutGrid } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(124, 71, 30,0.7)',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#EBC0A0',
        tabBarInactiveTintColor: '#7a3f11',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color, focused }) => (
            <House
              size={size}
              color={color}
              fill={focused ? color : 'transparent'} // fill when active
            />
          ),
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: 'Categories',
          tabBarIcon: ({ size, color, focused }) => (
            <LayoutGrid
              size={size}
              color={color}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Heart
              size={34}
              color="#B80813"
              fill='#B80813'
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ size, color, focused }) => (
            <ShoppingCart
              size={size}
              color={color}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color, focused }) => (
            <User
              size={size}
              color={color}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
    </Tabs>
  );
}  