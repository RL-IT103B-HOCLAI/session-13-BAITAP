const cargoList = [
    {
        cargoId: 'CG001',
        cargoName: 'Vali hanh ly',
        cargoType: 'STANDARD',
        weight: 120,
        zone: 'ZONE_STANDARD',
        flightNumber: 'VN-210'
    },
    {
        cargoId: 'CG002',
        cargoName: 'Thiet bi dien tu',
        cargoType: 'FRAGILE',
        weight: 250,
        zone: 'ZONE_FRAGILE',
        flightNumber: 'VN-210'
    },
    {
        cargoId: 'CG003',
        cargoName: 'Thuc pham tuoi song',
        cargoType: 'COLD',
        weight: 400,
        zone: 'ZONE_COLD',
        flightNumber: 'VN-210'
    }
];

const PAYLOAD_CAPACITY = 5000;
const WARNING_THRESHOLD = PAYLOAD_CAPACITY * 0.85;
const FLIGHT_NUMBER = 'VN-210';

function findCargoById(cargoId) {
    for (let i = 0; i < cargoList.length; i++) {
        if (cargoList[i].cargoId === cargoId) {
            return cargoList[i];
        }
    }

    return null;
}

function generateCargoId() {
    let maxId = 0;

    for (let i = 0; i < cargoList.length; i++) {
        const number = Number(cargoList[i].cargoId.substring(2));

        if (number > maxId) {
            maxId = number;
        }
    }

    return 'CG' + String(maxId + 1).padStart(3, '0');
}

function getStorageZone(cargoType) {
    if (cargoType === 'STANDARD') {
        return 'ZONE_STANDARD';
    } else if (cargoType === 'FRAGILE') {
        return 'ZONE_FRAGILE';
    } else if (cargoType === 'COLD') {
        return 'ZONE_COLD';
    }

    return null;
}

function calculateTotalWeight() {
    let totalWeight = 0;

    for (let i = 0; i < cargoList.length; i++) {
        if (cargoList[i].flightNumber === FLIGHT_NUMBER) {
            totalWeight += cargoList[i].weight;
        }
    }

    return totalWeight;
}

function checkPayloadWarning() {
    const totalWeight = calculateTotalWeight();
    const usagePercent = totalWeight / PAYLOAD_CAPACITY * 100;

    console.log('\n===== KIEM TRA TAI TRONG CHUYEN BAY =====');
    console.log('Chuyen bay: ' + FLIGHT_NUMBER);
    console.log('Tong trong luong: ' + totalWeight + ' kg');
    console.log('Tai trong toi da: ' + PAYLOAD_CAPACITY + ' kg');
    console.log('Ty le su dung: ' + usagePercent.toFixed(2) + '%');

    if (totalWeight > PAYLOAD_CAPACITY) {
        console.log('CANH BAO: VUOT QUA TAI TRONG AN TOAN!');
    } else if (totalWeight > WARNING_THRESHOLD) {
        console.log('CANH BAO VANG: Tai trong vuot 85%!');
    } else {
        console.log('Trang thai: Tai trong an toan.');
    }
}

function addCargo() {
    console.log('\n===== NHAP KIEN HANG MOI =====');

    const cargoName = prompt('Nhap ten kien hang: ').trim();

    if (cargoName === '') {
        console.log('Loi: Ten kien hang khong duoc de trong!');
        return;
    }

    console.log('Loai hang:');
    console.log('1. Hanh ly vali thuong');
    console.log('2. Do dien tu / Thuy tinh');
    console.log('3. Thuc pham tuoi song');

    const typeChoice = prompt('Chon loai hang (1-3): ').trim();
    let cargoType;

    if (typeChoice === '1') {
        cargoType = 'STANDARD';
    } else if (typeChoice === '2') {
        cargoType = 'FRAGILE';
    } else if (typeChoice === '3') {
        cargoType = 'COLD';
    } else {
        console.log('Loi: Loai hang khong hop le!');
        return;
    }

    const inputWeight = prompt('Nhap trong luong (kg): ').trim();
    const weight = Number(inputWeight);

    if (
        inputWeight === '' ||
        !Number.isFinite(weight) ||
        weight <= 0
    ) {
        console.log('Loi: Trong luong phai lon hon 0!');
        return;
    }

    const currentWeight = calculateTotalWeight();

    if (currentWeight + weight > PAYLOAD_CAPACITY) {
        console.log('TU CHOI: Kien hang lam vuot tai trong toi da!');
        console.log('Tai trong hien tai: ' + currentWeight + ' kg');
        console.log('Tai trong con lai: ' +
            (PAYLOAD_CAPACITY - currentWeight) + ' kg');
        return;
    }

    const zone = getStorageZone(cargoType);

    const newCargo = {
        cargoId: generateCargoId(),
        cargoName: cargoName,
        cargoType: cargoType,
        weight: weight,
        zone: zone,
        flightNumber: FLIGHT_NUMBER
    };

    cargoList.push(newCargo);

    console.log('Nhap kien hang thanh cong!');
    console.log('Ma kien hang: ' + newCargo.cargoId);
    console.log('Phan khu kho: ' + newCargo.zone);

    const newTotal = calculateTotalWeight();

    if (newTotal > WARNING_THRESHOLD) {
        console.log('CANH BAO VANG: Tai trong vuot 85% dinh muc!');
    }
}

function listCargoByZone() {
    console.log('\n===== KIEM KE HANG HOA THEO PHAN KHU =====');

    const zones = [
        'ZONE_STANDARD',
        'ZONE_FRAGILE',
        'ZONE_COLD'
    ];

    for (let z = 0; z < zones.length; z++) {
        console.log('\n' + zones[z]);
        console.log('-'.repeat(75));

        console.log(
            'Ma kien'.padEnd(12) +
            'Ten kien hang'.padEnd(25) +
            'Loai hang'.padEnd(15) +
            'Trong luong'
        );

        let found = false;

        for (let i = 0; i < cargoList.length; i++) {
            const cargo = cargoList[i];

            if (cargo.zone === zones[z]) {
                console.log(
                    cargo.cargoId.padEnd(12) +
                    cargo.cargoName.padEnd(25) +
                    cargo.cargoType.padEnd(15) +
                    cargo.weight + ' kg'
                );

                found = true;
            }
        }

        if (!found) {
            console.log('Khong co kien hang trong phan khu nay.');
        }
    }
}

function exportCargoManifest() {
    console.log('\n' + '='.repeat(85));
    console.log('                  CARGO MANIFEST - ' + FLIGHT_NUMBER);
    console.log('='.repeat(85));

    console.log(
        'Ma kien'.padEnd(12) +
        'Ten hang'.padEnd(25) +
        'Loai hang'.padEnd(15) +
        'Phan khu'.padEnd(20) +
        'Trong luong'
    );

    console.log('-'.repeat(85));

    let totalWeight = 0;
    let totalItems = 0;

    for (let i = 0; i < cargoList.length; i++) {
        const cargo = cargoList[i];

        if (cargo.flightNumber === FLIGHT_NUMBER) {
            console.log(
                cargo.cargoId.padEnd(12) +
                cargo.cargoName.padEnd(25) +
                cargo.cargoType.padEnd(15) +
                cargo.zone.padEnd(20) +
                cargo.weight + ' kg'
            );

            totalWeight += cargo.weight;
            totalItems++;
        }
    }

    console.log('-'.repeat(85));
    console.log('Tong so kien: ' + totalItems);
    console.log('Tong trong luong: ' + totalWeight + ' kg');
    console.log('Tai trong toi da: ' + PAYLOAD_CAPACITY + ' kg');

    if (totalWeight > PAYLOAD_CAPACITY) {
        console.log('TRANG THAI: VUOT TAI - KHONG DUOC XUAT HANG LEN MAY BAY!');
    } else if (totalWeight > WARNING_THRESHOLD) {
        console.log('TRANG THAI: CANH BAO VANG - KIEM TRA TAI TRONG!');
    } else {
        console.log('TRANG THAI: TRONG GIOI HAN AN TOAN.');
    }

    console.log('='.repeat(85));
}

function showMenu() {
    console.log('\n===== AIRPORT CARGO MANAGEMENT =====');
    console.log('1. Nhap kien hang moi');
    console.log('2. Kiem ke theo phan khu kho');
    console.log('3. Kiem tra tai trong chuyen bay');
    console.log('4. Xuat Cargo Manifest');
    console.log('0. Thoat chuong trinh');
}

function main() {
    let menuChoice;

    do {
        showMenu();

        const input = prompt('Nhap lua chon: ');

        if (input === null) {
            menuChoice = '0';
        } else {
            menuChoice = input.trim();
        }

        switch (menuChoice) {
            case '1':
                addCargo();
                break;

            case '2':
                listCargoByZone();
                break;

            case '3':
                checkPayloadWarning();
                break;

            case '4':
                exportCargoManifest();
                break;

            case '0':
                console.log('Da thoat chuong trinh!');
                break;

            default:
                console.log('Lua chon khong hop le! Vui long nhap 0-4.');
        }
    } while (menuChoice !== '0');
}

main();