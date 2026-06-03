interface TrackingUpdateLocation {
    Comments: string;
    UpdateCode: string;
    OrderNumber: string;
    ProblemCode: string;
    WaybillNumber: string;
    UpdateDateTime: string;
    UpdateLocation: string;
}

interface TrackingStatus {
    Comments: string;
    UpdateCode: string;
    UpdateDateTime: string;
    UpdateLocation: TrackingUpdateLocation;
}

export interface TrackingResult {
    WaybillNumber: string;
    UpdateCode: string;
    UpdateDescription: string;
    UpdateDateTime: string;
    UpdateLocation: string;
    Comments: string;
    ProblemCode: string;
    GrossWeight: string;
    ChargeableWeight: string;
    WeightUnit: string;
}

interface TrackingResultsItem {
    Key: string;
    Value: TrackingResult[];
}

export interface ITrackShipmentResponse {
    TrackingResults: TrackingResultsItem[];
    orderResponse: string;
    shipmentStatus: TrackingStatus[];
    amount: string;
    NonExistingWaybills: string[];
}

export interface ITrackingDetails {
    trackingNo: string;
    trackingResults: TrackingResult[];
    amount: string;
    shipmentStatus: TrackingStatus[];
    orderResponse: string;
}
