// MMN a MOW Paraíba
// NXU a NXW Pernambuco
// OJR a OKC Rio Grande do Norte

// ABC 1C34

const PB_SEQUENCES = [
    ['MMN', 'MOW'],
    ['NPR', 'NQK'],
    ['OET', 'OFH'],
    ['OFX', 'OGG'],
    ['OXO', 'OXO'],
    ['QFA', 'QFZ'],
    ['QSA', 'QSM'],
    ['RLQ', 'RLZ'],
    ['SKU', 'SLF']
];

const PE_SEQUENCES = [
    ['KFD', 'KME'],
    ['NXU', 'NXW'],
    ['PEE', 'PFQ'],
    ['PFR', 'PGK'],
    ['PGL', 'PGU'],
    ['OYL', 'OYZ'],
    ['PCA', 'PED'],
    ['PGV', 'PGZ'],
    ['QYA', 'QYZ'],
    ['RZE', 'RZZ'],
    ['SNK', 'SPB']
    
];

const RN_SEQUENCES = [
    ['MXH', 'MZM'],
    ['NNJ', 'NOH'],
    ['OJR', 'OKC'],
    ['OVZ', 'OWG'],
    ['QGA', 'QGZ'],
    ['RGN', 'RGN'],
    ['RGE', 'RGM'],
    ['RQA', 'RQL']

];

export function isOnCharInterval(beginChar: string, endChar: string, char: string): boolean {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let indexOfFirst = alphabet.indexOf(beginChar);
    let indexOfSecond = alphabet.indexOf(endChar);
    let indexOfChar = alphabet.indexOf(char);

    if (indexOfFirst > indexOfSecond) {
        return (indexOfFirst >= indexOfChar || indexOfSecond <= indexOfChar);
    }

    return (indexOfFirst <= indexOfChar && indexOfSecond >= indexOfChar);

}

export function isSequenceOnInterval(beginSequence: string, endSequence: string, sequence: string): boolean {
    let result = [false, false, false];
    for (let i = 0; i < 3; i++) {
        let char = sequence.charAt(i);
        let beginSequenceChar = beginSequence.charAt(i);
        let endSequenceChar = endSequence.charAt(i);

        result[i] = isOnCharInterval(beginSequenceChar, endSequenceChar, char);
    }

    return (result[0] && result[1] && result[2]);
}

export function findSignState(placa: string): string {
    if (placa.length < 3) return "ERRO";

    let sequence = placa.slice(0, 3);

    // checando intervalos de placa da Paraíba
    for (const interval of PB_SEQUENCES) {
        
        
        if (isSequenceOnInterval(interval[0], interval[1], sequence)) {
            return "Paraíba";
        }
    }

    for (const interval of PE_SEQUENCES) {
        if (isSequenceOnInterval(interval[0], interval[1], sequence)) {
            return "Pernambuco";
        }
    }

    for (const interval of RN_SEQUENCES) {
        if (isSequenceOnInterval(interval[0], interval[1], sequence)) {
            return "Rio Grande do Norte";
        }
    }

    return "Outro estado";
}
