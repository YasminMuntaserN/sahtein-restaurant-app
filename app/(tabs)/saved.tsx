import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Star, Clock, Trash2, ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { SavedItem } from '@/types/types';
import { useCart } from '@/context/AppContext';



export default function Saved() {
  const { savedItems, removeFromSavedItems, clearSavedItems } = useCart();

  const removeFromSaved = (id: number) => {
    Alert.alert(
      'Remove from Saved',
      'Are you sure you want to remove this item from your saved list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromSavedItems(id)
        }
      ]
    );
  };

  const handleItemPress = (item: SavedItem) => {
    router.push({
      pathname: '/dish-details',
      params: { dishId: item.id }
    });
  };

  if (savedItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved Items</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Heart size={80} color="#876d4c" />
          <Text style={styles.emptyTitle}>No saved items yet</Text>
          <Text style={styles.emptySubtitle}>Save your favorite dishes to find them easily later</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push('/(tabs)/home')}
          >
            <Text style={styles.exploreButtonText}>Explore Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ChevronLeft size={32} style={styles.backArrow} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Saved Items</Text>
        <Text style={styles.itemCount}>{savedItems.length} items</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {savedItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.savedItem}
            onPress={() => handleItemPress(item)}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromSaved(item.id)}
                >
                  <Heart size={20} color="#ff4444" fill="#ff4444" />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.itemMeta}>
                <View style={styles.rating}>
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <View style={styles.time}>
                  <Clock size={14} color="#876d4c" />
                  <Text style={styles.timeText}>20-30</Text>
                </View>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.clearAllButton}
          onPress={() => {
            Alert.alert(
              'Clear All Saved Items',
              'Are you sure you want to remove all saved items?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Clear All',
                  style: 'destructive',
                  onPress: () => clearSavedItems()
                }
              ]
            );
          }}
        >
          <Trash2 size={20} color="#ff4444" />
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(229,187,131, 0.8)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: '#F0D0A0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7a3f11',
  },
  backArrow: {
    fontWeight: 'bold',
    color: '#7a3f11',
    marginRight: 10,
  },
  itemCount: {
    fontSize: 16,
    color: '#876d4c',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  savedItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#F0D0A0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  itemImage: {
    width: 120,
    height: 120,
  },
  itemDetails: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#311D07',
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    padding: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#876d4c',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  timeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#876d4c',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7a3f11',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ff4444',
    backgroundColor: 'rgba(251, 189, 189, 0.5)'
  },
  clearAllText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#311D07',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#876d4c',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  exploreButton: {
    backgroundColor: '#7a3f11',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});