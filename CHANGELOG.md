## 2.0.0 (October 6, 2021)

### Release 2.0.0

- **_auto parsing_** `Err.eSplit(e)` do return [msg, value]: [`string`, `E | null`].
- this is kind of huge change, so i had to upgrade the major version...
- adding _unwrap_or, unwrap_or_else, unwrap_err_ on the interface of Result(=IResult)
- fixes README.md

---

## 1.4.0 (October 6, 2021)

### Release 1.4.0

- **_JSON.stringify(value<T or E>)_** implemented
- so from now on, can be converted each output errors (e.g JSON.parse(Err.eSplit(e)[1]) === `value<E>`)
- `createErrSet({...})`.match(e, '...').unwrap() will automatically parse out

---

## 1.3.0 (October 6, 2021)

### Release 1.3.0

- new feature: **_unwrap_** -> `unwrap_or`, `unwrap_or_else`, `unwrap_err`

---

## 1.2.1 (October 6, 2021)

### Release 1.2.1

- **_ErrSet_** -> .new() ** returning type `bug fix`ed **

---

## 1.2.0 (October 6, 2021)

### Release 1.2.0

- defining Result interface: IResult
- new feature: **_Error Set_** -> `createErrorSet`, `ErrSet`

---

## 1.1.3 (October 5, 2021)

### Release 1.1.3

- typing error... v1.1.0 & v1.1.1 & v1.1.2 is not availabled

---

## 1.1.0 (October 5, 2021)

### Release 1.1.0

- tsc compiled (typescript 4.4.3)
- Err.eSplit now can take unknown value type
