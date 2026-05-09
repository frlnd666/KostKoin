import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const sendPushOnNotif = onDocumentCreated(
  'notifications/{userId}/items/{notifId}',
  async (event) => {
    const notif  = event.data?.data()
    const userId = event.params.userId
    if (!notif) return

    // Ambil FCM token milik user dari Firestore
    const userSnap = await admin.firestore().doc(`users/${userId}`).get()
    const fcmToken = userSnap.data()?.fcmToken
    if (!fcmToken) return

    try {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: notif.title ?? 'KostKoin',
          body:  notif.body  ?? '',
        },
        // Data tambahan untuk routing saat notif diklik
        data: {
          screen:    notif.data?.screen    ?? '',
          bookingId: notif.data?.bookingId ?? '',
        },
        android: {
          notification: {
            sound:     'default',
            priority:  'high',
            channelId: 'kostkoin_notif',
          },
        },
        webpush: {
          notification: {
            icon:    '/icon-192.png',
            badge:   '/icon-72.png',
            vibrate: [200, 100, 200],
          },
          fcmOptions: {
            link: notif.data?.screen
              ? `https://kostkoin.vercel.app/${notif.data.screen}`
              : 'https://kostkoin.vercel.app/',
          },
        },
      })
    } catch (err) {
      console.error('Gagal kirim push notif:', err)
    }
  }
)
