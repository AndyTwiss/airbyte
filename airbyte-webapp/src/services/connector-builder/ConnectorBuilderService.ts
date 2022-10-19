import { useConfig } from "config";
import { AirbyteRequestService } from "core/request/AirbyteRequestService";
import {
  StreamRead,
  StreamReadRequestBody,
  StreamReadRequestBodyConfig,
  StreamReadRequestBodyConnectorDefinition,
  StreamsListRead,
  StreamsListRequestBody,
} from "core/request/ConnectorBuilderClient";
import { useSuspenseQuery } from "services/connector/useSuspenseQuery";
import { useDefaultRequestMiddlewares } from "services/useDefaultRequestMiddlewares";
import { useInitService } from "services/useInitService";

class ConnectorBuilderService extends AirbyteRequestService {
  public readStream(body: StreamReadRequestBody): Promise<StreamRead> {
    // TODO: uncomment this once there is a real API to call
    // return readStream(body, this.requestOptions);
    return new Promise((resolve) => setTimeout(resolve, 200)).then(() => {
      return {
        slices: [
          {
            sliceDescriptor: { start: "Jan 1, 2022", end: "Jan 2, 2022" },
            pages: [
              {
                airbyteMessages: [
                  {
                    type: "RECORD",
                    record: {
                      stream: "disputes",
                      data: {
                        id: "dp_123",
                        object: "dispute",
                        amount: 2000,
                        balance_transaction: "txn_123",
                      },
                    },
                  },
                ],
                request: {
                  url: "https://api.com/path",
                },
                response: {
                  status: 200,
                },
              },
            ],
          },
        ],
      };
    });
  }

  public listStreams(body: StreamsListRequestBody): Promise<StreamsListRead> {
    // TODO: uncomment this once there is a real API to call
    // return listStreams(body, this.requestOptions);
    return new Promise((resolve) => setTimeout(resolve, 200)).then(() => {
      return {
        streams: [
          {
            name: "disputes",
            url: "https://api.com/disputes",
          },
          {
            name: "transactions",
            url: "https://api.com/transactions",
          },
          {
            name: "users",
            url: "https://api.com/users",
          },
        ],
      };
    });
  }
}

const connectorBuilderKeys = {
  all: ["connectorBuilder"] as const,
  read: (
    streamName: string,
    connectorDefinition: StreamReadRequestBodyConnectorDefinition,
    config: StreamReadRequestBodyConfig
  ) => [...connectorBuilderKeys.all, "read", { streamName, connectorDefinition, config }] as const,
  list: (connectorDefinition: StreamReadRequestBodyConnectorDefinition) =>
    [...connectorBuilderKeys.all, "list", { connectorDefinition }] as const,
};

function useConnectorBuilderService() {
  const config = useConfig();
  const middlewares = useDefaultRequestMiddlewares();
  return useInitService(
    () => new ConnectorBuilderService(config.connectorBuilderApiUrl, middlewares),
    [config.connectorBuilderApiUrl, middlewares]
  );
}

export const useReadStream = (params: StreamReadRequestBody) => {
  const service = useConnectorBuilderService();

  return useSuspenseQuery(connectorBuilderKeys.read(params.stream, params.connectorDefinition, params.config), () =>
    service.readStream(params)
  );
};
