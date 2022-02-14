# audit-log-package

## How to initialise this SDK in applications

```
import { Logger } from "audit-log-package";

export const logger = new Logger();
```

## Usage

### Inside functions

#### Construct the payload and pass it inside logger

```
logger.info(payload);
```
