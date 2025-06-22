import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Star,
  Clock,
  Minus,
  Plus,
  ShoppingCart,
  Info
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFetch } from '@/hooks/useFetch';
import { getDishById } from '@/api/api';
import { useCart } from '@/context/AppContext';
import { CartItem, SavedItem } from '@/types/types';

export default function DishDetails() {
  const { dishId } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const { data: dish, loading, error } = useFetch(() => getDishById(Number(dishId)));
  const { addToCart, addToSavedItems, savedItems, removeFromSavedItems } = useCart();

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    const item: CartItem = {
      id: dish?.id || 0,
      name: dish?.name || '',
      image: dish?.image_url || '',
      price: dish?.price || 0,
      quantity: quantity,
      category: ""
    };
    addToCart(item);
    router.push({
      pathname: '/cart'
    });
  };

  const toggleSaved = () => {
    const found = savedItems.find(el => el.id === dish?.id);
    if (!found) {
      const item: SavedItem = {
        id: dish?.id || 0,
        name: dish?.name || '',
        image: dish?.image_url || '',
        price: dish?.price || 0,
        description: dish?.description || '',
        rating: dish?.rating || 0,
        category: ""
      };
      addToSavedItems(item);
    } else {
      removeFromSavedItems(dish?.id || 0);
    }
  };

  useEffect(() => {
    const found = savedItems.find(el => el.id === dish?.id);
    setIsSaved(found ? true : false);
  }, [dish, savedItems])

  return (
    <SafeAreaView style={styles.container}>
      {loading ? <ActivityIndicator /> :
        <View style={{ flex: 1 }}>
          {/* Header with Image Background */}
          <ImageBackground
            source={{ uri: dish?.image_url }}
            resizeMode="cover"
            style={styles.header}
          >
            <View style={styles.headerOverlay}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <ArrowLeft size={24} color="#876d4c" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={toggleSaved}>
                <Heart
                  size={24}
                  color={isSaved ? "#ff4444" : "#876d4c"}
                  fill={isSaved ? "#ff4444" : "transparent"}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Dish Info */}
            <View style={styles.dishInfo}>
              {/* Dish Header */}
              <View style={styles.dishHeader}>
                <Text style={styles.dishName}>{dish?.name}</Text>
                {dish?.price && (
                  <Text style={styles.dishPrice}>${dish.price.toFixed(2)}</Text>
                )}
              </View>

              {/* Rating and Time */}
              <View style={styles.dishMeta}>
                {dish?.rating && (
                  <View style={styles.rating}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{dish.rating}</Text>
                    <Text style={styles.reviewsText}>(Reviews)</Text>
                  </View>
                )}
                <View style={styles.time}>
                  <Clock size={16} color="#876d4c" />
                  <Text style={styles.timeText}>25-30 min</Text>
                </View>
              </View>

              {/* Description */}
              <View style={styles.descriptionContainer}>
                <View style={styles.descriptionHeader}>
                  <Info size={20} color="#7a3f11" />
                  <Text style={styles.descriptionTitle}>About this dish</Text>
                </View>
                <Text style={styles.description}>{dish?.description}</Text>
              </View>

              {/* Nutrition Information - Only show if available */}
              {dish?.nutritional_info && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Nutrition Information</Text>
                  <View style={styles.nutritionContainer}>
                    <Text style={styles.nutritionText}>{dish.nutritional_info}</Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Bottom Action Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <TouchableOpacity
                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus size={20} color={quantity <= 1 ? "#ccc" : "#876d4c"} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(1)}
              >
                <Plus size={20} color="#876d4c" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.addToCartButton, loading && styles.addToCartButtonDisabled]}
              onPress={handleAddToCart}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ShoppingCart size={20} color="#fff" />
              )}
              <Text style={styles.addToCartText}>
                {loading ? 'Adding...' : `Add to Cart • $${((dish?.price || 0) * quantity).toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(229,187,131 ,0.8)',
  },
  header: {
    height: 400,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255,0.4)',
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  dishInfo: {
    backgroundColor: 'rgba(229,187,131 ,0.2)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: 500,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dishName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#311D07',
    flex: 1,
    marginRight: 15,
    lineHeight: 34,
  },
  dishPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7a3f11',
  },
  dishMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#311D07',
    fontWeight: '600',
  },
  reviewsText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#876d4c',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#876d4c',
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255, 255, 255,0.4)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0D0A0',
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7a3f11',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#311D07',
    lineHeight: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#311D07',
    marginBottom: 12,
  },
  nutritionContainer: {
    backgroundColor: 'rgba(255, 255, 255,0.4)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0D0A0',
  },
  nutritionText: {
    fontSize: 16,
    color: '#311D07',
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255,0.4)',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: -40,
    paddingBottom: 40
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#311D07',
    marginRight: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5BB83',
  },
  quantityButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#311D07',
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7a3f11',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#7a3f11',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addToCartButtonDisabled: {
    opacity: 0.7,
  },
  addToCartText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});