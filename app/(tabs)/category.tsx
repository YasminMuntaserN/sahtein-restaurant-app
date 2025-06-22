import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search } from 'lucide-react-native';
import { useFetch } from "@/hooks/useFetch";
import { getCategories, getFoods, getFoodsByCategory } from "@/api/api";
import { Food, Category as ICategory } from "@/types/types"
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';


export default function Category() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const { data: categories, loading, error } = useFetch(getCategories);
  const [dishes, setDishes] = useState<Food[]>([]);
  const [foodLoading, setFoodLoading] = useState(false);
  const [foodError, setFoodError] = useState('');


  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setFoodLoading(true);
        setFoodError('');
        let data: Food[] = [];

        if (selectedCategoryId === 1) {
          data = await getFoods();
        } else {
          console.log(selectedCategoryId);
          data = await getFoodsByCategory(selectedCategoryId);
        }

        setDishes(data);
      } catch (err) {
        console.error(err);
        setFoodError('Failed to load foods');
      } finally {
        setFoodLoading(false);
      }
    };

    fetchFoods();
  }, [selectedCategoryId]);

  const handleItemPress = (item: Food) => {
    router.push({
      pathname: '/dish-details',
      params: { dishId: item.id }
    });
  };


  const renderDishItem = ({ item }: { item: Food }) => (
    <TouchableOpacity style={styles.dishCard} onPress={() => handleItemPress(item)}>
      <Image source={{ uri: item.image_url }} style={styles.dishImage} />
      <View style={styles.dishInfo}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.dishFooter}>
          <Text style={styles.dishPrice}>${item.price}</Text>
          <Text style={styles.dishRating}>⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ChevronLeft size={32} style={styles.backArrow} onPress={() => router.back()} />
        <Text style={styles.headerTitle}> Discover our Dishes : </Text>
      </View>

      {(error || foodError) && <Text>Something went wrong</Text>}
      {(loading || foodLoading) ? <ActivityIndicator /> : (
        <View>
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
                onPress={() => setSelectedCategoryId(category.id)}
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

          <FlatList
            data={dishes}
            renderItem={renderDishItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.dishesContainer}
            columnWrapperStyle={styles.dishRow}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(229,187,131 ,0.8)',
  },
  backArrow: {
    fontWeight: 'bold',
    color: '#7a3f11',
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7a3f11',
  },
  filterButton: {
    padding: 8,
  },
  categoriesScroll: {
    height: 150,
    paddingLeft: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
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
    color: '#7A3F11',
    fontWeight: '600',
    textAlign: 'center',
  },
  dishesContainer: {
    padding: 15,
  },
  dishRow: {
    justifyContent: 'space-between',
  },
  dishCard: {
    backgroundColor: 'rgba(255, 255, 255,0.4)',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    width: '48%',
  },
  dishImage: {
    width: '100%',
    height: 120,
  },
  dishInfo: {
    padding: 12,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#311D07',
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 12,
    color: '#876d4c',
    marginBottom: 8,
    lineHeight: 16,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7a3f11',
  },
  dishRating: {
    fontSize: 12,
    color: '#311D07',
  },
});