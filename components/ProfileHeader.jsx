import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '../store/authStore'
import { Image } from 'expo-image'
import styles from '../assets/styles/profile.styles'
import { formatMemberSince } from '../lib/utils'

export default function ProfileHeader() {
    const { user } = useAuthStore();
    return (
        <View style={styles.profileHeader}>
            <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />

            <View>
                <Text style={styles.username}>{user?.username}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <Text style={styles.phone}>📞 {user?.phone}</Text>
                <Text style={styles.memberSince}>Joined {formatMemberSince(user?.createdAt)}</Text>
            </View>
        </View>
    )
}
