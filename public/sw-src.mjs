/* eslint-disable no-restricted-globals */
// sw-src.js
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);
