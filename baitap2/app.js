const passengers = [
    {
        pnrCode: 'VN001',
        passengerName: 'Nguyen Van An',
        idNumber: '012345678901',
        flightNumber: 'VN201',
        seatNumber: '12A',
        isCheckedIn: true
    },
    {
        pnrCode: 'VN002',
        passengerName: 'Tran Thi Mai',
        idNumber: 'B12345678',
        flightNumber: 'VN201',
        seatNumber: '',
        isCheckedIn: false
    }
];

const availableSeats = [
    '12A', '12B', '12C',
    '14A', '14B', '14C',
    '15A', '15B', '15C'
];

function findPassengerByPnr(pnrCode) {
    for (let i = 0; i < passengers.length; i++) {
        if (passengers[i].pnrCode === pnrCode) {
            return passengers[i];
        }
    }

    return null;
}

function validateIdNumber(idNumber) {
    const cccdPattern = /^\d{12}$/;
    const passportPattern = /^[A-Za-z]\d{7,8}$/;

    return cccdPattern.test(idNumber) ||
        passportPattern.test(idNumber);
}

function validatePassengerData(passengerName, idNumber, flightNumber) {
    if (
        passengerName.trim() === '' ||
        idNumber.trim() === '' ||
        flightNumber.trim() === ''
    ) {
        console.log('Loi: Khong duoc de trong thong tin!');
        return false;
    }

    if (!validateIdNumber(idNumber.trim())) {
        console.log(
            'Loi: CCCD phai co 12 chu so hoac ho chieu gom 1 chu cai va 7-8 chu so!'
        );
        return false;
    }

    return true;
}

function isSeatTaken(flightNumber, seatNumber) {
    for (let i = 0; i < passengers.length; i++) {
        if (
            passengers[i].flightNumber === flightNumber &&
            passengers[i].seatNumber === seatNumber &&
            passengers[i].isCheckedIn
        ) {
            return true;
        }
    }

    return false;
}

function assignSeat(flightNumber) {
    for (let i = 0; i < availableSeats.length; i++) {
        if (!isSeatTaken(flightNumber, availableSeats[i])) {
            return availableSeats[i];
        }
    }

    return null;
}

function addPassenger() {
    console.log('\n===== TIEP NHAN HO SO HANH KHACH =====');

    const pnrCode = prompt('Nhap ma dat cho PNR: ')
        .trim()
        .toUpperCase();

    if (pnrCode === '') {
        console.log('Loi: PNR khong duoc de trong!');
        return;
    }

    if (findPassengerByPnr(pnrCode) !== null) {
        console.log('Loi: Ma PNR da ton tai!');
        return;
    }

    const passengerName = prompt('Nhap ho ten hanh khach: ').trim();
    const idNumber = prompt('Nhap CCCD/Ho chieu: ').trim().toUpperCase();
    const flightNumber = prompt('Nhap ma chuyen bay: ')
        .trim()
        .toUpperCase();

    if (!validatePassengerData(passengerName, idNumber, flightNumber)) {
        return;
    }

    for (let i = 0; i < passengers.length; i++) {
        if (passengers[i].idNumber === idNumber) {
            console.log('Loi: Giay to nay da duoc dang ky!');
            return;
        }
    }

    passengers.push({
        pnrCode: pnrCode,
        passengerName: passengerName,
        idNumber: idNumber,
        flightNumber: flightNumber,
        seatNumber: '',
        isCheckedIn: false
    });

    console.log('Tiep nhan ho so thanh cong!');
}

function verifyPassenger() {
    console.log('\n===== XAC THUC GIAY TO =====');

    const pnrCode = prompt('Nhap ma PNR: ')
        .trim()
        .toUpperCase();

    const passenger = findPassengerByPnr(pnrCode);

    if (passenger === null) {
        console.log('Khong tim thay ho so hanh khach!');
        return;
    }

    if (!validateIdNumber(passenger.idNumber)) {
        console.log('XAC THUC THAT BAI: Giay to khong hop le!');
        return;
    }

    console.log('XAC THUC DINH DANG GIAY TO THANH CONG');
    console.log('Ma PNR: ' + passenger.pnrCode);
    console.log('Ho ten: ' + passenger.passengerName);
    console.log('So giay to: ' + passenger.idNumber);
    console.log('Chuyen bay: ' + passenger.flightNumber);
    console.log('Luu y: He thong chi kiem tra dinh dang, khong xac minh giay to that.');
}

function checkIn() {
    console.log('\n===== CHECK-IN HANH KHACH =====');

    const pnrCode = prompt('Nhap ma PNR: ')
        .trim()
        .toUpperCase();

    const passenger = findPassengerByPnr(pnrCode);

    if (passenger === null) {
        console.log('Loi: Khong tim thay ma PNR!');
        return;
    }

    if (passenger.isCheckedIn) {
        console.log('Hanh khach da check-in truoc do!');
        displayBoardingPass(passenger);
        return;
    }

    if (!validateIdNumber(passenger.idNumber)) {
        console.log('Khong the check-in: Giay to khong hop le!');
        return;
    }

    const seatNumber = assignSeat(passenger.flightNumber);

    if (seatNumber === null) {
        console.log('Khong con ghe trong tren chuyen bay!');
        return;
    }

    passenger.seatNumber = seatNumber;
    passenger.isCheckedIn = true;

    console.log('Check-in thanh cong!');
    displayBoardingPass(passenger);
}

function displayBoardingPass(passenger) {
    console.log('\n' + '='.repeat(48));
    console.log('             BOARDING PASS');
    console.log('='.repeat(48));
    console.log('PNR CODE      : ' + passenger.pnrCode);
    console.log('PASSENGER     : ' + passenger.passengerName);
    console.log('FLIGHT        : ' + passenger.flightNumber);
    console.log('SEAT          : ' + passenger.seatNumber);
    console.log('DOCUMENT      : ' + passenger.idNumber);
    console.log('CHECK-IN      : ' +
        (passenger.isCheckedIn ? 'CONFIRMED' : 'NOT CHECKED IN'));
    console.log('-'.repeat(48));
    console.log('BARCODE       : ||| || |||| | ||| || ||||');
    console.log('='.repeat(48));
}

function listPassengers() {
    console.log('\n===== DANH SACH HANH KHACH =====');

    if (passengers.length === 0) {
        console.log('Chua co ho so hanh khach!');
        return;
    }

    console.log(
        'PNR'.padEnd(10) +
        'Ho ten'.padEnd(22) +
        'Chuyen bay'.padEnd(13) +
        'Ghe'.padEnd(8) +
        'Check-in'
    );

    console.log('-'.repeat(65));

    for (let i = 0; i < passengers.length; i++) {
        const passenger = passengers[i];

        console.log(
            passenger.pnrCode.padEnd(10) +
            passenger.passengerName.padEnd(22) +
            passenger.flightNumber.padEnd(13) +
            (passenger.seatNumber || 'Chua co').padEnd(8) +
            (passenger.isCheckedIn ? 'Da check-in' : 'Chua check-in')
        );
    }
}

function showMenu() {
    console.log('\n===== HE THONG CHECK-IN SAN BAY =====');
    console.log('1. Xem danh sach hanh khach');
    console.log('2. Tiep nhan ho so moi');
    console.log('3. Xac thuc giay to');
    console.log('4. Check-in va cap ghe');
    console.log('5. Thoat chuong trinh');
}

function main() {
    let menuChoice;

    do {
        showMenu();

        const input = prompt('Nhap lua chon (1-5): ');

        if (input === null) {
            menuChoice = '5';
        } else {
            menuChoice = input.trim();
        }

        switch (menuChoice) {
            case '1':
                listPassengers();
                break;

            case '2':
                addPassenger();
                break;

            case '3':
                verifyPassenger();
                break;

            case '4':
                checkIn();
                break;

            case '5':
                console.log('Ket thuc chuong trinh!');
                break;

            default:
                console.log('Lua chon khong hop le!');
        }
    } while (menuChoice !== '5');
}

main();