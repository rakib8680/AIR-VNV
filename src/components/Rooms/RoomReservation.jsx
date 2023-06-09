import { formatDistance } from 'date-fns';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useNavigation } from 'react-router-dom';
import { addBooking, updateStatus } from '../../api/bookings';
import { AuthContext } from '../../providers/AuthProvider';
import Button from '../Button/Button';
import BookingModal from '../Modal/BookingModal';
import Calender from './Calender'

const RoomReservation = ({ roomData }) => {

    const navigate = useNavigate()
    const { user, role } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const totalPrice = parseInt(formatDistance(new Date(roomData.to), new Date(roomData.from)).split(' ')[0]) * roomData.price
    const [value, setValue] = useState({
        startDate: new Date(roomData?.from),
        endDate: new Date(roomData?.to),
        key: 'selection'
    })


    const [bookingInfo, setBookingInfo] = useState({
        guest: { name: user.displayName, email: user.email, image: user.photoURL },
        host: roomData?.host.email,
        location: roomData?.location,
        price: totalPrice,
        to: value.endDate,
        from: value.startDate,
        title: roomData?.title,
        roomId: roomData?._id
    });


    const handleSelect = () => {
        setValue({ ...value })
    };

    const modalHandler = () => {
        addBooking(bookingInfo)
            .then(data => {
                if (data.insertedId) {
                    updateStatus(roomData?._id, true)
                        .then(data => {
                            toast.success('Booking successfully')
                            navigate('/dashboard/my-bookings')
                            closeModal()
                        })
                }
            })
            .catch(err => {
                toast.error(err.message)
                closeModal()
            })
    };
    const closeModal = () => {
        setIsOpen(false)
    }

    return (
        <div className='bg-white rounded-xl  border-[1px] border-neutral-200 overflow-hidden'>
            <div className='flex  items-center gap-2 p-4'>
                <div className='text-2xl font-semibold '>
                    $ {roomData.price}
                </div>
                <div className='font-light text-neutral-600 '>
                    night
                </div>
            </div>
            <hr />
            <div className="flex justify-center">
                <Calender value={value} handleSelect={handleSelect} />
            </div>
            <hr />
            <div className='p-4 '>
                <Button onClick={() => {
                    setIsOpen(true)
                }} disabled={roomData?.host.email === user?.email || roomData.booked} label='Reserve' />
            </div>
            <div className='p-4 flex items-center justify-between font-bold text-lg'>
                <div>Total</div>
                <div>$ {totalPrice}</div>
            </div>
            <BookingModal
                bookingInfo={bookingInfo}
                isOpen={isOpen}
                modalHandler={modalHandler}
                closeModal={closeModal} />
        </div>
    );
};

export default RoomReservation;