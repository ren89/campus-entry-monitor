// RFID scanner hook props
export interface UseRFIDScannerProps {
  onScan: (rfidData: string) => void;
  minLength?: number;
  timeout?: number;
}
