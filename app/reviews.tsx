import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Star,
  MessageSquare,
  Send,
  Camera,
  CheckCircle
} from 'lucide-react-native';
import { router } from 'expo-router';
import { addReview } from '@/api/api';
import { Review } from '@/types/types';
import { useCart } from '@/context/AppContext';

export default function Reviews() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useCart();

  const handleStarPress = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting your review.');
      return;
    }

    setIsSubmitting(true);
    const review: Review = {
      rating,
      description: reviewText,
      user_id: currentUser?.id || 0,
    };

    try {
      const res = await addReview(review);

      if (res?.success) {
        Alert.alert(
          'Thank you!',
          'Your review has been submitted successfully. We appreciate your feedback!',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsSubmitting(false);
                router.push('/(tabs)/home');
              }
            }
          ]
        );
      } else {
        const errorMessage = res?.error?.message || 'review submition failed';
        Alert.alert('review submition Failed', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      const errorMessage = 'Something went wrong. Please try again.';
      Alert.alert('Error', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSkipReview = () => {
    Alert.alert(
      'Skip Review',
      'Are you sure you want to skip leaving a review?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Skip',
          onPress: () => router.push('/(tabs)/home')
        }
      ]
    );
  };

  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Rate your experience';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ChevronLeft
          size={32}
          style={styles.backArrow}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Leave a Review</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Thank You Message */}
        <View style={styles.section}>
          <View style={styles.thankYouContainer}>
            <CheckCircle size={48} color="#7a3f11" />
            <Text style={styles.thankYouTitle}>Order Completed!</Text>
            <Text style={styles.thankYouSubtitle}>
              We hope you enjoyed your coffee experience
            </Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleStarPress(index)}
                  style={styles.starButton}
                >
                  <Star
                    size={36}
                    color={index < rating ? '#ffc201' : '#8D8170'}
                    fill={index < rating ? '#ffc201' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingText}>{getRatingText()}</Text>
          </View>
        </View>

        {/* Written Review Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share your thoughts</Text>
          <View style={styles.reviewInputContainer}>
            <MessageSquare size={20} color="#876d4c" style={styles.messageIcon} />
            <TextInput
              style={styles.reviewInput}
              placeholder="Tell us about your experience (optional)"
              placeholderTextColor="#876d4c"
              multiline
              numberOfLines={4}
              value={reviewText}
              onChangeText={setReviewText}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Review Guidelines */}
        <View style={styles.section}>
          <Text style={styles.guidelinesTitle}>Review Guidelines</Text>
          <Text style={styles.guidelinesText}>
            • Be honest and helpful{'\n'}
            • Focus on your experience{'\n'}
            • Keep it respectful{'\n'}
            • Reviews help other customers make informed decisions
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkipReview}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled
          ]}
          onPress={handleSubmitReview}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <React.Fragment>
              <Send size={18} color="#fff" style={styles.sendIcon} />
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </React.Fragment>
          )}
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
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#8D8170',
  },
  thankYouContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    padding: 20,
  },
  thankYouTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#311D07',
    marginTop: 10,
    marginBottom: 5,
  },
  thankYouSubtitle: {
    fontSize: 16,
    color: '#876d4c',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#311D07',
    marginBottom: 15,
  },
  ratingContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    padding: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
    marginHorizontal: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#311D07',
  },
  reviewInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  reviewInput: {
    flex: 1,
    fontSize: 16,
    color: '#311D07',
    minHeight: 80,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#8D8170',
    borderStyle: 'dashed',
  },
  photoButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#876d4c',
    fontWeight: '500',
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#311D07',
    marginBottom: 10,
  },
  guidelinesText: {
    fontSize: 14,
    color: '#876d4c',
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#8D8170',
  },
  skipButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#8D8170',
  },
  skipButtonText: {
    color: '#876d4c',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#7a3f11',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#8D8170',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  sendIcon: {
    marginRight: 5,
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
  },
  errorText: {
    color: '#CC0000',
    fontSize: 14,
    textAlign: 'center',
  },
});