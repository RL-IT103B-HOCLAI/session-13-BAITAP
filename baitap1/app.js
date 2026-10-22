const tickets = [
    {
        pnr: 'VN001',
        passengerName: 'Nguyen Van An',
        flightNumber: 'VN201',
        seat: '12A',
        ticketClass: 'ECONOMY',
        baggageWeight: 25,
        baggageFee: 0,
        status: 'BOOKED'
    },
    {
        pnr: 'VN002',
        passengerName: 'Tran Thi Mai',
        flightNumber: 'VN305',
        seat: '02B',
        ticketClass: 'BUSINESS',
        baggageWeight: 20,
        baggageFee: 0,
        status: 'BOOKED'
    },
    {
        pnr: 'VN003',
        passengerName: 'Le Van Nam',
        flightNumber: 'VN201',
        seat: '15C',
        ticketClass: 'ECONOMY',
        baggageWeight: 18,
        baggageFee: 0,
        status: 'BOOKED'
    }
];

const EXCESS_BAGGAGE_FEE = 50000;

function findTicketByPnr(pnr) {
    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].pnr === pnr) {
            return tickets[i];
        }
    }

    return null;
}

function findTicketByPassengerName(name) {
    for (let i = 0; i < tickets.length; i++) {
        if (
            tickets[i].passengerName.toLowerCase() ===
            name.toLowerCase()
        ) {
            return tickets[i];
        }
    }

    return null;
}

function calculateExcessBaggageFee(ticket, baggageWeight) {
    let freeWeight;

    if (ticket.ticketClass === 'ECONOMY') {
        freeWeight = 20;
    } else if (ticket.ticketClass === 'BUSINESS') {
        freeWeight = 30;
    } else {
        return -1;
    }

    if (baggageWeight <= freeWeight) {
        return 0;
    }

    return (baggageWeight - freeWeight) * EXCESS_BAGGAGE_FEE;
}

function displayBoardingPass(ticket) {
    console.log('\n========================================');
    console.log('             BOARDING PASS');
    console.log('========================================');
    console.log('Ma dat cho  : ' + ticket.pnr);
    console.log('Hanh khach  : ' + ticket.passengerName);
    console.log('Chuyen bay  : ' + ticket.flightNumber);
    console.log('Ghe ngoi    : ' + ticket.seat);
    console.log('Hang ve     : ' + ticket.ticketClass);
    console.log('Hanh ly     : ' + ticket.baggageWeight + ' kg');
    console.log(
        'Phi hanh ly : ' +
        ticket.baggageFee.toLocaleString('vi-VN') +
        ' VND'
    );
    console.log('Trang thai  : ' + ticket.status);
    console.log('========================================');
}

function checkIn() {
    console.log('\n===== CHECK-IN HANH KHACH =====');

    const pnr = prompt('Nhap ma dat cho PNR: ')
        .trim()
        .toUpperCase();

    if (pnr === '') {
        console.log('Loi: Ma PNR khong duoc de trong!');
        return;
    }

    const ticket = findTicketByPnr(pnr);

    if (ticket === null) {
        console.log('Khong tim thay ve!');
        return;
    }

    if (ticket.status === 'CANCELLED') {
        console.log('Ve da bi huy, khong the check-in!');
        return;
    }

    if (ticket.status === 'CHECKED_IN') {
        console.log('Hanh khach da check-in truoc do!');
        displayBoardingPass(ticket);
        return;
    }

    const inputWeight = prompt('Nhap khoi luong hanh ly (kg): ').trim();
    const baggageWeight = Number(inputWeight);

    if (
        inputWeight === '' ||
        !Number.isFinite(baggageWeight) ||
        baggageWeight < 0
    ) {
        console.log('Loi: Can nang phai la so khong am!');
        return;
    }

    const baggageFee = calculateExcessBaggageFee(
        ticket,
        baggageWeight
    );

    if (baggageFee < 0) {
        console.log('Hang ve khong hop le!');
        return;
    }

    ticket.baggageWeight = baggageWeight;
    ticket.baggageFee = baggageFee;
    ticket.status = 'CHECKED_IN';

    console.log('Check-in thanh cong!');
    console.log(
        'Phi hanh ly phai thu: ' +
        baggageFee.toLocaleString('vi-VN') +
        ' VND'
    );

    displayBoardingPass(ticket);
}

function listTickets() {
    console.log('\n================ DANH SACH VE MAY BAY ================');

    if (tickets.length === 0) {
        console.log('Khong co ve nao trong he thong.');
        return;
    }

    console.log(
        'PNR'.padEnd(10) +
        'Hanh khach'.padEnd(22) +
        'Chuyen bay'.padEnd(13) +
        'Ghe'.padEnd(8) +
        'Hang ve'.padEnd(12) +
        'Hanh ly'.padEnd(12) +
        'Trang thai'
    );

    console.log('-'.repeat(90));

    for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];

        console.log(
            ticket.pnr.padEnd(10) +
            ticket.passengerName.padEnd(22) +
            ticket.flightNumber.padEnd(13) +
            ticket.seat.padEnd(8) +
            ticket.ticketClass.padEnd(12) +
            (ticket.baggageWeight + ' kg').padEnd(12) +
            ticket.status
        );
    }
}

function searchTicket() {
    console.log('\n===== TRA CUU VE =====');
    console.log('1. Tim theo ma PNR');
    console.log('2. Tim theo ten hanh khach');

    const choice = prompt('Nhap lua chon: ').trim();
    let ticket = null;

    if (choice === '1') {
        const pnr = prompt('Nhap ma PNR: ')
            .trim()
            .toUpperCase();

        if (pnr === '') {
            console.log('Ma PNR khong duoc de trong!');
            return;
        }

        ticket = findTicketByPnr(pnr);
    } else if (choice === '2') {
        const name = prompt('Nhap ten hanh khach: ').trim();

        if (name === '') {
            console.log('Ten hanh khach khong duoc de trong!');
            return;
        }

        ticket = findTicketByPassengerName(name);
    } else {
        console.log('Lua chon khong hop le!');
        return;
    }

    if (ticket === null) {
        console.log('Khong tim thay ve phu hop!');
        return;
    }

    displayBoardingPass(ticket);
}

function cancelTicket() {
    console.log('\n===== HUY VE MAY BAY =====');

    const pnr = prompt('Nhap ma PNR can huy: ')
        .trim()
        .toUpperCase();

    if (pnr === '') {
        console.log('Ma PNR khong duoc de trong!');
        return;
    }

    const ticket = findTicketByPnr(pnr);

    if (ticket === null) {
        console.log('Khong tim thay ve!');
        return;
    }

    if (ticket.status === 'CANCELLED') {
        console.log('Ve nay da duoc huy truoc do!');
        return;
    }

    const confirmCancel = prompt(
        'Xac nhan huy ve? (Y/N): '
    ).trim().toUpperCase();

    if (confirmCancel === 'Y') {
        ticket.status = 'CANCELLED';
        console.log('Huy ve thanh cong!');
    } else {
        console.log('Da huy thao tac huy ve.');
    }
}

function showMenu() {
    console.log('\n========== HE THONG QUAN LY VE MAY BAY ==========');
    console.log('1. Hien thi danh sach ve');
    console.log('2. Check-in va tinh phi hanh ly');
    console.log('3. Tra cuu ve');
    console.log('4. Huy ve');
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
                listTickets();
                break;

            case '2':
                checkIn();
                break;

            case '3':
                searchTicket();
                break;

            case '4':
                cancelTicket();
                break;

            case '5':
                console.log('Ket thuc ca lam viec!');
                break;

            default:
                console.log('Lua chon khong hop le!');
        }
    } while (menuChoice !== '5');
}

main();