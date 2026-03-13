declare module '@m-lab/ndt7' {
  interface NDT7Config {
    userAcceptedDataPolicy?: boolean;
    downloadworkerfile?: string;
    uploadworkerfile?: string;
    metadata?: Record<string, string>;
  }

  interface NDT7Callbacks {
    serverChosen?: (server: { machine: string }) => void;
    downloadMeasurement?: (data: {
      Source: string;
      Data: {
        MeanClientMbps?: number;
        NumBytes?: number;
        TCPInfo?: { MinRTT?: number; SmoothedRTT?: number };
        ElapsedTime?: number;
      };
    }) => void;
    downloadComplete?: (data: any) => void;
    uploadMeasurement?: (data: {
      Source: string;
      Data: {
        MeanClientMbps?: number;
        ElapsedTime?: number;
      };
    }) => void;
    uploadComplete?: (data: any) => void;
    error?: (err: string | Error) => void;
  }

  const ndt7: {
    test(config: NDT7Config, callbacks: NDT7Callbacks): void;
  };

  export default ndt7;
}
