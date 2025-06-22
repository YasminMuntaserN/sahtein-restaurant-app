import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Animated,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Star, Clock, MapPin, Bell, Menu } from 'lucide-react-native';
import { router } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { useFetch } from '@/hooks/useFetch';
import { getCategories } from '@/api/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Category, Food } from '@/types/types';

const { width, height } = Dimensions.get('window');

const featuredDishes = [
  {
    id: 1,
    name: 'Grilled Salmon',
    image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg',
    price: 24.99,
    rating: 4.8,
    time: '25 min',
    category: 'Seafood',
    discount: '20% OFF'
  },
  {
    id: 2,
    name: 'Beef Steak',
    image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg',
    price: 32.99,
    rating: 4.9,
    time: '30 min',
    category: 'Meat'
  },
  {
    id: 3,
    name: 'Pasta Carbonara',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    price: 18.99,
    rating: 4.7,
    time: '20 min',
    category: 'Italian',
    isPopular: true
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const { data: categories, loading, error } = useFetch(getCategories);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleDishPress = (dish: Food) => {
    router.push({
      pathname: '/dish-details',
      params: { dishId: dish.id }
    });
  };

  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: '/category',
      params: { categoryId: category.id }
    });
  };

  if (error) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Something went wrong</Text>
    </View>
  );

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#7a3f11" />
    </View>
  );

  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require('../../assets/images/bg.jpg')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.container}>
            {/* Header */}
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <TouchableOpacity style={styles.menuButton}>
                <Menu size={24} color="white" />
              </TouchableOpacity>

              <View style={styles.locationContainer}>
                <View style={styles.locationWrapper}>
                  <MapPin size={16} color="#FFD700" />
                  <Text style={styles.locationLabel}>Deliver to</Text>
                </View>
                <Text style={styles.location}>Palestine, Gaza</Text>
              </View>

              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={24} color="white" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Search Bar */}
            <Animated.View
              style={[
                styles.searchContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.searchBar}>
                <Search size={20} color="#876d4c" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for dishes..."
                  placeholderTextColor="#876d4c"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </Animated.View>

            {/* Brand Section */}
            <Animated.View
              style={[
                styles.brandContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.8)']}
                style={styles.brandGradient}
              >
                <View style={styles.logoContainer}>
                  <View style={styles.logoCircle}>
                    <Ionicons name="restaurant" size={28} color="#7a3f11" />
                  </View>
                  <View style={styles.brandTextContainer}>
                    <Text style={styles.brandTitle}>Sahtein</Text>
                    <Text style={styles.brandSubtitle}>
                      A taste that tells our story
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              {/* Categories Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Categories</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesScroll}
                  contentContainerStyle={styles.categoriesContent}
                >
                  {categories?.map((category, index) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryCard,
                        index === 0 && styles.firstCategory
                      ]}
                      onPress={() => handleCategoryPress(category)}
                    >
                      <View style={styles.categoryImageContainer}>
                        <Image
                          source={{ uri: category.image_url }}
                          style={styles.categoryImage}
                          resizeMode="cover"
                        />
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.3)']}
                          style={styles.categoryGradient}
                        />
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Featured Dishes */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Featured Dishes</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>

                {featuredDishes.map((dish, index) => (
                  <TouchableOpacity
                    key={dish.id}
                    style={styles.dishCard}
                    onPress={() => handleDishPress(dish)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.8)']}
                      style={styles.dishCardGradient}
                    >
                      <View style={styles.dishImageContainer}>
                        <Image
                          source={{ uri: dish.image }}
                          style={styles.dishImage}
                        />
                        {dish.discount && (
                          <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{dish.discount}</Text>
                          </View>
                        )}
                        {dish.isPopular && (
                          <View style={styles.popularBadge}>
                            <Star size={12} color="#fff" fill="#fff" />
                            <Text style={styles.popularText}>Popular</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.dishInfo}>
                        <View style={styles.dishHeader}>
                          <Text style={styles.dishName}>{dish.name}</Text>
                          <Text style={styles.dishPrice}>${dish.price}</Text>
                        </View>

                        <Text style={styles.dishCategory}>{dish.category}</Text>

                        <View style={styles.dishMeta}>
                          <View style={styles.rating}>
                            <Star size={14} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.ratingText}>{dish.rating}</Text>
                          </View>
                          <View style={styles.time}>
                            <Clock size={14} color="#876d4c" />
                            <Text style={styles.timeText}>{dish.time}</Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Bottom Padding */}
              <View style={styles.bottomPadding} />
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(229,187,131, 0.8)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(229,187,131, 0.8)',
  },
  errorText: {
    color: '#7a3f11',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  menuButton: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
  },
  locationContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 20,
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  location: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#311D07',
  },
  brandContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  brandGradient: {
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(122, 63, 17, 0.1)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  brandTextContainer: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7a3f11',
    marginBottom: 4,
  },
  brandSubtitle: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryCard: {
    marginRight: 15,
    alignItems: 'center',
  },
  firstCategory: {
    marginLeft: 0,
  },
  categoryImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  categoryName: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  dishCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  dishCardGradient: {
    flexDirection: 'row',
  },
  dishImageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#7a3f11',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  dishInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#311D07',
    flex: 1,
    marginRight: 10,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7a3f11',
  },
  dishCategory: {
    fontSize: 12,
    color: '#876d4c',
    marginBottom: 8,
    fontWeight: '500',
  },
  dishMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#311D07',
    fontWeight: '600',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(135, 109, 76, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  timeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#876d4c',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
});