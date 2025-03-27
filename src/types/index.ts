import { lineDataItem } from "react-native-gifted-charts";

export type Screen = {
    HomeScreen: undefined;
    Analytics: undefined;
    Settings: undefined;
    Profile: undefined;
};

// export type NavigationProps = NativeStackScreenProps<Screen>;

export interface Tank {
    actuators: Actuator[];
    sensors: Sensor[];
    capacity: number;
    created: Date;
    height: number;
    offset: number;
    id: string;
    length?: number;
    meta: MetaInformation;
    modified: string;
    name: string;
    notifications: { messages: Notification[] };
    radius: number;
    width?: number;
    analytics: Analytics;
}

export interface X extends Tank {
    consumption: lineDataItem[];
    isSelect: boolean;
    liters: number;
    temp: number;
    tds: string;
    on: boolean;
    usage?: string;
}

// export type Consumption = {
//   value: any;
//   label: number;
//   dataPointLabelComponent: () => {};
// };

export type Actuator = {
    created: Date;
    id: string;
    meta: ActuatorMeta;
    modified: Date;
    name: string;
    time: Date | null;
    value: { state: number };
};

type ActuatorMeta = {
    kind: "Motor" | "Any";
    external: boolean //actuator is used externally (not actuated by the same device where actuator is mounted)
};

export type MetaInformation = {
    receivenotifications: boolean;
    notifications: {
        messages: Notification[];
    };
    location: {
        cordinates: {
            longitude: number;
            latitude: number;
        };
        address: string;
    };
    settings: {
        height: number;
        offset: number;
        capacity: number;
    };
    profile: Profile;

    actuatorID?: string;
    assigned?: boolean;
};

export type Sensor = {
    created: Date;
    id: string;
    kind: string;
    meta: SensorAlert;
    modified: Date;
    name: string;
    quantity: number;
    time: string;
    unit: string;
    value: 1 | 0;
};

export type Analytics = {
    average: Average;
    trend: Trend;
    durationLeft: number;
};

export type SensorAlert = {
    critical_min: number;
    critical_max: number;
    kind: string;
};

interface Average {
    hourly: number;
    daily: number;
}

interface Trend {
    value: number;
    amountUsed: number;
    days: number;
    indicator: string;
}

export type WiFi = {
    SSID: string;
    password?: string;
    isWep?: any;
    capabilities?: [];
};

export type Profile = {
    first_name: string;
    last_name: string;
    username: string;
    phone: string;
    email: string;
    address: string;
};

export type UserProfile = {
    profile?: Profile;
    token?: string;
};

export type Time = {
    from?: Date;
    to?: Date;
    refetch?: boolean;
};

export type TankViewProp = {
    owner?: string;
    liters: number;
    waterTemp?: number;
    waterQuality?: string;
    on?: boolean;
    consumption: lineDataItem[];
    actuator?: Actuator[];
    height: number;
    capacity: number;
    toggleActuator?: (id: string) => Promise<boolean>;
    id: string;
    receiveNotifications?: boolean;
    name: string;
};

export type Notification = {
    title: string;
    body: string;
    to?: string;
    tank_name?: string;
    id?: string;
    // date?: string;
    priority?: string;
    message?: string;
    read_status?: boolean;
    time?: string;
    deviceId?: string;
};

export type Filter = "Tanks" | "Actuators" | "Meters";

// ------------------->

export type SensorData = {
    value: {
        date_received: "2024-07-25T23:53:33Z";
        value: 500;
        timestamp: "2024-07-25T23:53:33Z";
    };
    name: string;
    id: string;
};

export type ActuatorData = {};

export type OnlineTank = {
    gateway_id: string;
    date_modified: string;
    owner: string;
    name: string;
    id: string;
    sensors: SensorData[];
    actuators: ActuatorData[];
    date_created: string;
};
