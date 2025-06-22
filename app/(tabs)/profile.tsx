import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft, CircleHelp as HelpCircle,
  Settings, LogOut, ChevronRight, CreditCard as Edit, Star, Clock, Lock
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useCart } from '@/context/AppContext';
import { Review } from '@/types/types';
import { getReviewsByUserId } from '@/api/api';

export default function Profile() {
  const { currentUser, savedItems } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
    joinDate: Date.now().toLocaleString(),
    totalOrders: 0,
    favoriteRestaurants: 0,
    reviewsGiven: 0
  });

  const getDate = (date: string | undefined) => {
    return date ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : Date.now().toLocaleString();
  }
  useEffect(() => {
    if (currentUser) {

      setUser({
        name: currentUser.full_name,
        email: currentUser.email,
        avatar: currentUser.avatar_url,
        joinDate: getDate(currentUser?.created_at),
        totalOrders: 5,
        favoriteRestaurants: savedItems.length,
        reviewsGiven: 0
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (currentUser?.id) {
          const res = await getReviewsByUserId(currentUser?.id);
          if (res?.success) {
            setReviews(res?.data || [])
          } else {
            const errorMessage = res?.error?.message || 'loading user Reviews failed';
            Alert.alert('loading user Reviews failed', errorMessage);
            setError(errorMessage);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        const errorMessage = 'Something went wrong. Please try again.';
        Alert.alert('Error', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => router.replace('/(auth)/sign-in')
        }
      ]
    );
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ChevronLeft
          size={32}
          style={styles.backArrow}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Hello , {currentUser.full_name} 🖐️</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.favoriteRestaurants}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{reviews.length}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.reviewsContainer}>
          <View style={styles.reviewsHeader}>
            <View style={styles.titleContainer}>
              <Star size={24} color="#FFD700" fill="#FFD700" />
              <Text style={styles.reviewsSectionTitle}>Your Reviews</Text>
            </View>
            <TouchableOpacity
              style={styles.addReviewButton}
              onPress={() => router.push('/reviews')}
              activeOpacity={0.8}
            >
              <View style={styles.addButtonContent}>
                <Text style={styles.addButtonIcon}>+</Text>
                <Text style={styles.addButtonText}>Add Review</Text>
              </View>
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.reviewsContent}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7a3f11" />
                <Text style={styles.loadingText}>Loading your reviews...</Text>
              </View>
            ) : reviews.length === 0 ? (
              <View style={styles.emptyReviewsContainer}>
                <View style={styles.emptyIconContainer}>
                  <Star size={48} color="#D4C4B0" />
                </View>
                <Text style={styles.emptyReviewsTitle}>No Reviews Yet</Text>
                <Text style={styles.emptyReviewsSubtitle}>
                  Share your dining experiences with others by writing your first review!
                </Text>
              </View>
            ) : (
              <View style={styles.reviewsList}>
                {reviews.map((review, index) => (
                  <View key={review.id} style={[
                    styles.modernReviewCard,
                    index === reviews.length - 1 && styles.lastReviewCard
                  ]}>
                    <View style={styles.reviewCardHeader}>
                      <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              color={star <= review.rating ? "#FFD700" : "#E5E5E5"}
                              fill={star <= review.rating ? "#FFD700" : "#E5E5E5"}
                            />
                          ))}
                        </View>
                        <Text style={styles.ratingText}>{review.rating}.0</Text>
                      </View>
                      <View style={styles.dateContainer}>
                        <Clock size={12} color="#876d4c" />
                        <Text style={styles.reviewDateText}>{getDate(review.created_at)}</Text>
                      </View>
                    </View>

                    <Text style={styles.reviewDescription}>{review.description}</Text>

                    <View style={styles.reviewFooter}>
                      <View style={styles.reviewBadge}>
                        <Text style={styles.badgeText}>Verified Review</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>


        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#ff4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Sahtein v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 Sahtein Restaurant</Text>
          <Text style={styles.appCopyright}>By Yasmin Muntaser ❤️</Text>

        </View>
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#311D07',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#876d4c',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#876d4c',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 12,
    color: '#7a3f11',
    fontStyle: 'italic',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 20,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7a3f11',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#876d4c',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#311D07',
    marginVertical: 10,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#311D07',
    marginBottom: 15,
  },
  reviewsContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#7a3f11',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  addReviewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  reviewsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#876d4c',
  },
  emptyReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyReviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#311D07',
    marginBottom: 8,
  },
  emptyReviewsSubtitle: {
    fontSize: 14,
    color: '#876d4c',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  reviewsList: {
    paddingTop: 16,
  },
  modernReviewCard: {
    backgroundColor: '#FEFCFA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#7a3f11',
    shadowColor: '#7a3f11',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lastReviewCard: {
    marginBottom: 0,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7a3f11',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDateText: {
    fontSize: 12,
    color: '#876d4c',
    marginLeft: 4,
  },
  reviewDescription: {
    fontSize: 15,
    color: '#311D07',
    lineHeight: 22,
    marginBottom: 16,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reviewBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2D7D32',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
  },
  errorText: {
    color: '#CC0000',
    fontSize: 14,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#311D07',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ff4444',
    backgroundColor: 'rgba(251, 189, 189, 0.5)',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#876d4c',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#876d4c',
  },
});