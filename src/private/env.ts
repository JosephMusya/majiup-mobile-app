// import { useDeviceContext } from "../providers/devices/DeviceProvider";

const production: boolean = false;

// const getIpAddress = () => {
//   const { ipAddress } = useDeviceContext();
//   return ipAddress;
// };

// const ipAddress = getIpAddress();

export const brokerUrl = production
    ? "mqtt://api.waziup.io"
    : "mqtt://localhost";
//   : "mqtt://localhost"

// export const backendUrl = production
//   ? "http://wazigate.local:8082/api/v1"
//   : "http://192.168.0.104:8082/api/v1";

export const getBackendUrl = (ipAddress: string | null | undefined) => {
    const url = {
        backendUrl: production
            ? `http://${ipAddress}:8082/api/v1`
            : `http://${ipAddress}:8082/api/v1`,
    };

    return url.backendUrl;
};

export const backendUrl = production
    ? `http://${0}:8082/api/v1`
    : "http://192.168.0.104:8082/api/v1";

// export const backendUrlOnline = production
//   ? "https://api.waziup.io/api/v2"
//   : "http://192.168.0.104:8082/api/v1";

export const urbaneAPI = "";
