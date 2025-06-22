import { useState } from 'react';
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
  Smartphone,
  Wallet,
  MapPin,
  Clock,
  Check
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useCart } from '@/context/AppContext';

export default function Payment() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const { totalPayment, clearCart } = useCart();

  const paymentMethods = [
    { id: 'apple', name: 'Apple Pay', icon: Smartphone },
    { id: 'google', name: 'Google Pay', icon: Smartphone },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet }
  ];


  const handlePayment = () => {
    Alert.alert(
      'Order Confirmed!',
      'Your order has been placed successfully. You will receive a confirmation email shortly.',
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            router.push('/reviews');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ChevronLeft size={32} style={styles.backArrow} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryItem}>
              <MapPin size={20} color="#876d4c" />
              <View style={styles.deliveryText}>
                <Text style={styles.deliveryLabel}>Address</Text>
                <Text style={styles.deliveryValue}>Palestine , Gaza </Text>
              </View>
            </View>
            <View style={styles.deliveryItem}>
              <Clock size={20} color="#876d4c" />
              <View style={styles.deliveryText}>
                <Text style={styles.deliveryLabel}>Delivery Time</Text>
                <Text style={styles.deliveryValue}>ASAP (30-45 min)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === method.id && styles.paymentMethodSelected
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.paymentMethodLeft}>
                <method.icon size={24} color="#876d4c" />
                <Text style={styles.paymentMethodText}>{method.name}</Text>
              </View>
              {selectedPaymentMethod === method.id && (
                <Check size={20} color="#7a3f11" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${totalPayment.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${totalPayment.deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${totalPayment.tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalPayment.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.section}>
          <Text style={styles.termsText}>
            By placing this order, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>
            Pay ${totalPayment.total.toFixed(2)}
          </Text>
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
    borderBottomColor: '#8D8170',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#311D07',
    marginBottom: 15,
  },
  deliveryInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    padding: 15,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryText: {
    marginLeft: 12,
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#876d4c',
    marginBottom: 2,
  },
  deliveryValue: {
    fontSize: 14,
    color: '#311D07',
    fontWeight: '600',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8D8170',
    marginBottom: 10,
  },
  paymentMethodSelected: {
    borderColor: '#7a3f11',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#311D07',
    fontWeight: '500',
  },
  orderSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    padding: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#311D07',
  },
  summaryValue: {
    fontSize: 16,
    color: '#311D07',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#876d4c',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#311D07',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7a3f11',
  },
  termsText: {
    fontSize: 12,
    color: '#876d4c',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
  },
  payButton: {
    backgroundColor: '#7a3f11',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});