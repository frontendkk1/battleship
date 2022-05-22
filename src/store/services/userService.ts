import {
    setUser,
    User,
    loadFailed,
    loadPending,
    loadSuccess,
    getTest,
} from '../reducers/user';
import { store } from '../../index';

export const userService = {
    setUser: (user: User | null) => store.dispatch(setUser(user)),
    failed: () => store.dispatch(loadFailed()),
    pending: () => store.dispatch(loadPending()),
    success: () => store.dispatch(loadSuccess()),
    onGetTest: () => store.dispatch(getTest()),
};