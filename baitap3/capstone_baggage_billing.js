const EXCESS_RATE_FIRST_5_KG = 60000;
const EXCESS_RATE_AFTER_5_KG = 80000;
const OVERSIZED_FEE = 200000;
const PET_FEE = 500000;

function getFreeBaggageAllowance(ticket) {
    let freeWeight;

    if (ticket.ticketClass === 'ECONOMY') {
        freeWeight = 20;
    } else if (ticket.ticketClass === 'BUSINESS') {
        freeWeight = 30;
    } else {
        return -1;
    }

    if (
        ticket.loyaltyTier === 'TITAN' ||
        ticket.loyaltyTier === 'GOLD' ||
        ticket.loyaltyTier === 'DIAMOND'
    ) {
        freeWeight += 10;
    }

    return freeWeight;
}

function calculateExcessFee(excessWeight) {
    if (excessWeight <= 0) {
        return 0;
    }

    if (excessWeight <= 5) {
        return excessWeight * EXCESS_RATE_FIRST_5_KG;
    }

    return 5 * EXCESS_RATE_FIRST_5_KG +
        (excessWeight - 5) * EXCESS_RATE_AFTER_5_KG;
}

function calculateBaggageSurcharge(ticket, baggageList) {
    if (!Array.isArray(baggageList)) {
        return {
            success: false,
            message: 'Danh sach hanh ly khong hop le!'
        };
    }

    const freeWeight = getFreeBaggageAllowance(ticket);

    if (freeWeight < 0) {
        return {
            success: false,
            message: 'Hang ve khong hop le!'
        };
    }

    let totalWeight = 0;
    let oversizedCount = 0;
    let petCount = 0;

    for (let i = 0; i < baggageList.length; i++) {
        const baggage = baggageList[i];

        if (
            typeof baggage.weight !== 'number' ||
            !Number.isFinite(baggage.weight) ||
            baggage.weight < 0
        ) {
            return {
                success: false,
                message: 'Can nang hanh ly khong hop le!'
            };
        }

        if (
            baggage.type !== 'NORMAL' &&
            baggage.type !== 'OVERSIZED' &&
            baggage.type !== 'PET'
        ) {
            return {
                success: false,
                message: 'Loai hanh ly khong hop le!'
            };
        }

        totalWeight += baggage.weight;

        if (baggage.type === 'OVERSIZED') {
            oversizedCount++;
        } else if (baggage.type === 'PET') {
            petCount++;
        }
    }

    const excessWeight = Math.max(0, totalWeight - freeWeight);
    const excessFee = calculateExcessFee(excessWeight);
    const oversizedFee = oversizedCount * OVERSIZED_FEE;
    const petFee = petCount * PET_FEE;
    const totalFee = excessFee + oversizedFee + petFee;

    return {
        success: true,
        totalWeight: totalWeight,
        freeWeight: freeWeight,
        excessWeight: excessWeight,
        excessFee: excessFee,
        oversizedCount: oversizedCount,
        oversizedFee: oversizedFee,
        petCount: petCount,
        petFee: petFee,
        totalFee: totalFee
    };
}

function formatVND(amount) {
    return amount.toLocaleString('vi-VN') + ' VND';
}

function printBaggageReceipt(ticket, result) {
    if (!result.success) {
        console.log('Khong the lap bien lai: ' + result.message);
        return;
    }

    const line = '='.repeat(58);

    console.log(`
${line}
                 BAGGAGE PAYMENT RECEIPT
${line}
PNR              : ${ticket.pnrCode}
Passenger        : ${ticket.passengerName}
Flight           : ${ticket.flightNumber}
Ticket class     : ${ticket.ticketClass}
Loyalty tier     : ${ticket.loyaltyTier || 'NONE'}
${'-'.repeat(58)}
Total weight     : ${result.totalWeight} kg
Free allowance   : ${result.freeWeight} kg
Excess weight    : ${result.excessWeight} kg
${'-'.repeat(58)}
Excess fee       : ${formatVND(result.excessFee).padStart(18)}
Oversized items  : ${String(result.oversizedCount).padStart(3)}
Oversized fee    : ${formatVND(result.oversizedFee).padStart(18)}
Pet containers   : ${String(result.petCount).padStart(3)}
Pet fee          : ${formatVND(result.petFee).padStart(18)}
${'-'.repeat(58)}
TOTAL TO PAY     : ${formatVND(result.totalFee)}
${line}
             THANK YOU FOR FLYING WITH US
${line}
    `);
}

const ticket = {
    pnrCode: 'VN001',
    passengerName: 'Nguyen Van An',
    flightNumber: 'VN201',
    ticketClass: 'ECONOMY',
    loyaltyTier: 'NONE'
};

const baggageList = [
    { type: 'NORMAL', weight: 15 },
    { type: 'NORMAL', weight: 13 },
    { type: 'OVERSIZED', weight: 8 },
    { type: 'PET', weight: 6 }
];

const result = calculateBaggageSurcharge(ticket, baggageList);
printBaggageReceipt(ticket, result);