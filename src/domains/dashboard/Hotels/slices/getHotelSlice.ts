import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { HotelRoom } from '../types/bookingTypes';
import { HotelCancellationPolicy } from '../types/cancellationTypes';
import { HotelSearch, Room } from '../types/hotelTypes';
import { RoomInfo } from '../types/types';

interface formDetails {
    FirstName: string;
    LastName: string;
    Country: string;
    Mobile: string;
}

interface getHotelState {
    country: string | undefined;
    city: string | undefined;
    checkIn: string;
    checkOut: string;
    travelerNationality?: string;
    rooms: RoomInfo[];
    travelerCountryOfResidence?: string;
}
interface handleSubmit {
    country: string | undefined;
    city: string | undefined;
    checkIn: string;
    checkOut: string;
    travelerNationality: string;
    travelerCountryOfResidence: string;
}

interface count {
    type: 'adult' | 'child';
    increment: boolean;
    index: number;
}

interface roomdata {
    roomIndex: number;
    name: string;
    price: number;
    roomKey: string;
}

interface keys {
    hotelKey: string;
    conversationId: string;
    searchKey: string;
}

interface BookingRoom {
    roomIndex: number;
    roomKey: string;
    passengerArray?: any[]; // Replace 'any[]' with the actual type of your passenger data
}

interface InitialState {
    hotelsRequest: getHotelState;
    hotelResponse: HotelSearch | {};
    roomResponse: roomdata[];
    reservedData: Room[];
    formData: formDetails;
    bookingRoom: BookingRoom[];
    keyData: keys;
    cancelPolicy: HotelCancellationPolicy | {};
    corporateTxnId: string;
    bookingKey: string;
    prebookRoomData: HotelRoom[];
    userdetails: any[];

    formCount: any[];
    hotelArr: any;
    nationality: string;
    countryOfResidence: string;
    prebookResponse: any;
    netAmount: number;
}

const initialState: InitialState = {
    hotelsRequest: {
        country: '',
        city: '',
        checkIn: '',
        checkOut: '',
        rooms: [{ adult: 1, child: 0, roomIndex: 1, childAge: [] }],
        travelerNationality: '',
        travelerCountryOfResidence: '',
    },
    bookingRoom: [],
    hotelResponse: {},
    roomResponse: [],
    reservedData: [],
    formData: {
        FirstName: '',
        LastName: '',
        Country: '',
        Mobile: '',
    },

    keyData: {
        searchKey: '',
        conversationId: '',
        hotelKey: '',
    },
    cancelPolicy: {},
    corporateTxnId: '',
    bookingKey: '',
    prebookRoomData: [],
    userdetails: [],
    formCount: [],
    hotelArr: {},
    nationality: '',
    countryOfResidence: '',
    prebookResponse: {},
    netAmount: 0,
};

export const getHotelSlice = createSlice({
    name: 'hotels',
    initialState,
    reducers: {
        setRoom: (state, action: PayloadAction<any>) => {
            if (action.payload.isAdd) {
                state.roomResponse.push(action.payload.roomInfo);
            } else {
                state.roomResponse = state.roomResponse.filter(
                    room => room.roomKey !== action.payload.roomInfo.roomKey
                );
            }
        },

        setRoomDetails: (state, action: PayloadAction<any>) => {
            state.reservedData = action.payload;
        },

        setKeys: (state, action: PayloadAction<keys>) => {
            state.keyData = action.payload;
        },
        getTxnId: (state, action: PayloadAction<string>) => {
            state.corporateTxnId = action.payload;
        },

        getBookingKey: (state, action: PayloadAction<string>) => {
            state.bookingKey = action.payload;
        },

        addRoom: state => {
            const index = state.hotelsRequest.rooms.length + 1;
            state.hotelsRequest = {
                ...state.hotelsRequest,
                rooms: [
                    ...state.hotelsRequest.rooms,
                    { adult: 1, child: 0, roomIndex: index, childAge: [] },
                ],
            };
        },

        addChildAge: (
            state,
            action: PayloadAction<{ roomIndex: number; childAge: number; ageIndex: number }>
        ) => {
            const { roomIndex, childAge, ageIndex } = action.payload;
            state.hotelsRequest.rooms[roomIndex].childAge[ageIndex] = childAge;
        },
        handleCount: (state, action: PayloadAction<count>) => {
            const { type, increment, index } = action.payload;

            const { rooms } = state.hotelsRequest;
            state.hotelsRequest.rooms[index] = {
                ...state.hotelsRequest.rooms[index],
                [type]: increment
                    ? state.hotelsRequest.rooms[index][type] + 1
                    : state.hotelsRequest.rooms[index][type] - 1,
                ...(type === 'child' && {
                    childAge: increment
                        ? [...(rooms[index].childAge as number[]), 2]
                        : rooms[index].childAge.slice(0, -1),
                }),
            };
        },

        deleteRoom: (state, action: PayloadAction<{ index: number }>) => {
            const { rooms } = state.hotelsRequest;
            rooms.splice(action.payload.index, 1);
            state.hotelsRequest = { ...state.hotelsRequest, rooms };
        },

        getHotels: (state, action: PayloadAction<handleSubmit>) => {
            state.hotelsRequest = { ...state.hotelsRequest, ...action.payload };
            return state;
        },

        getDetails: (state, action: PayloadAction<HotelSearch>) => {
            state.hotelResponse = { ...state.hotelResponse, ...action.payload };
        },

        getCancelPolicy: (state, action: PayloadAction<HotelCancellationPolicy>) => {
            state.cancelPolicy = { ...state.cancelPolicy, ...action.payload };
        },

        setFormDetails: (state, action: PayloadAction<formDetails>) => {
            state.formData = { ...state.formData, ...action.payload };
        },

        getPrebookData: (state, action: PayloadAction<any>) => {
            state.prebookRoomData = action.payload;
        },

        addPassengersData: (state, action: PayloadAction<any>) => {
            state.bookingRoom = action.payload;
        },

        addUserData: (state, action: PayloadAction<any>) => {
            if (state.userdetails.find(user => user.roomIndex === action.payload.roomIndex)) {
                const details = state.userdetails.find(
                    user => user.roomIndex === action.payload.roomIndex
                );

                const roomIndex = state.userdetails.findIndex(
                    user => user.roomIndex === action.payload.roomIndex
                );

                if (
                    details.passengers.find(
                        (passenger: any) =>
                            passenger.passengerKey === action.payload.userdetails.passengerKey
                    )
                ) {
                    const index = details.passengers.findIndex(
                        (passenger: any) =>
                            passenger.passengerKey === action.payload.userdetails.passengerKey
                    );

                    state.userdetails[roomIndex].passengers[index] = action.payload.userdetails;
                } else {
                    state.userdetails[roomIndex].passengers.push(action.payload.userdetails);
                }
            } else {
                state.userdetails.push({
                    roomKey: action.payload.roomKey,
                    roomIndex: action.payload.roomIndex,
                    passengers: [action.payload.userdetails],
                });
            }
        },
        TotalFormCount: (state, action: PayloadAction<any>) => {
            state.formCount = action.payload;
        },
        resetData: state => {
            state.hotelResponse = initialState.hotelResponse;
            return state;
        },
        resetUserDetails: state => {
            state.formCount = initialState.formCount;
            return state;
        },
        resetRoomResponse: state => {
            state.roomResponse = initialState.roomResponse;
            return state;
        },
        resetGetHotels: state => {
            state.hotelsRequest = initialState.hotelsRequest;
            return state;
        },
        sethotelArr: (state, action: PayloadAction<any>) => {
            state.hotelArr = action.payload;
        },
        resetHotelArr: state => {
            state.hotelArr = initialState.hotelArr;
            return state;
        },
        setTravelerNationality: (state, action: PayloadAction<any>) => {
            state.nationality = action.payload;
        },
        setcountryOfResidence: (state, action: PayloadAction<any>) => {
            state.countryOfResidence = action.payload;
        },
        setPrebookResponse: (state, action: PayloadAction<any>) => {
            state.prebookResponse = action.payload;
        },
        setNetAmount: (state, action: PayloadAction<any>) => {
            state.netAmount = action.payload;
        },
        resetNationality: state => {
            state.nationality = initialState.nationality;
            return state;
        },
        resetResidence: state => {
            state.countryOfResidence = initialState.countryOfResidence;
            return state;
        },
    },
});

export const {
    getHotels,
    getDetails,
    addRoom,
    deleteRoom,
    setRoom,
    handleCount,
    setFormDetails,
    setKeys,
    getCancelPolicy,
    getTxnId,
    getBookingKey,
    addChildAge,
    setRoomDetails,
    addPassengersData,
    getPrebookData,
    addUserData,
    TotalFormCount,
    resetData,
    resetUserDetails,
    resetRoomResponse,
    resetGetHotels,
    sethotelArr,
    resetHotelArr,
    setTravelerNationality,
    setcountryOfResidence,
    setPrebookResponse,
    setNetAmount,
    resetNationality,
    resetResidence,
} = getHotelSlice.actions;
export default getHotelSlice.reducer;
