
# Generating the ts files
## Reqirements
(These should already be included in package.json)
```
npm install @protobuf-ts/plugin @protobuf-ts/runtime
```

## Generation
Run the following command:

```
npx protoc --ts_out .\generated\ --ts_opt client_grpc1,optimize_code_size,use_proto_field_name -I . .\driver.proto
```
