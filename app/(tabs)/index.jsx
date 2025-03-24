import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_URL, useAuthStore } from '../../store/authStore'
import styles from '../../assets/styles/home.styles'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { formatPublishDate } from '../../lib/utils.js'
import COLORS from '../../constants/colors'
import Loader from '../../components/Loader.jsx'
import * as Clipboard from 'expo-clipboard';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function Home() {
  const { token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true)

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(`${API_URL}/api/books?page=${pageNum}&limit=2`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch books");
      // setBooks((prevBooks) => [...prevBooks, ...data.books]);

      const uniqueBooks = refresh || pageNum === 1
        ? data.books
        : Array.from(new Set([...books, ...data.books].map((book) => book._id)))
          .map((id) => [...books, ...data.books].find((book) => book._id === id));


      setBooks(uniqueBooks);

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.log("Error fetching books", error);
    } finally {
      if (refresh) {
        await sleep(800);
        setRefreshing(false)
      }
      else setLoading(false);
    }
  }
  useEffect(() => {
    fetchBooks();
  }, [])

  const handleLoadMore = async () => {
    if (!hasMore || loading || refreshing) return;
    await fetchBooks(page + 1);
  };

  const copyToClipboard = (phoneNumber) => {
    Clipboard.setStringAsync(phoneNumber);
    Alert.alert("Copied!", `Phone number ${phoneNumber} copied to clipboard.`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userDetails}>
            <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
            <Text style={styles.username}>{item?.user?.username}</Text>
          </View>
  
          {/* Phone number aligned to the right */}
          <TouchableOpacity onPress={() => copyToClipboard(item?.user?.phone)}>
            <Text style={styles.phoneNumber}>📞 {item?.user?.phone}</Text>
          </TouchableOpacity>
        </View>
      </View>
  
      <View style={styles.bookImageContainer}>
        <Image source={{ uri: item.image?.url || item.image }} style={styles.bookImage} contentFit="cover" />
      </View>
  
      {/* Book details */}
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item?.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item?.rating)}</View>
        <Text style={styles.caption}>{item?.caption}</Text>
  
        {/* Price and Date aligned to opposite sides */}
        <View style={styles.priceAndDateContainer}>
          <Text style={styles.price}>Price: ₹{item?.price}</Text>
          <Text style={styles.date}>Shared on {formatPublishDate(item?.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
  


  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary} // Fixed syntax error
          style={{ marginRight: 2 }} // Removed invalid character "I"
        />
      );
    }
    return stars;
  };

  if (loading) return <Loader size='small' />

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id} contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary} />
        }

        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}

        ListHeaderComponent={<View style={styles.header}>
          <Text style={styles.headerTitle}>BookWorm</Text>
          <Text style={styles.headerSubtitle}>Discover great reads from the community</Text>
        </View>}

        ListFooterComponent={
          hasMore ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />
          ) : books.length === 0 ? null : (
            <Text style={styles.footerText}>No more books to load</Text>
          )
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='book-outline' size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share a book!</Text>
          </View>
        } />
    </View>
  )
}