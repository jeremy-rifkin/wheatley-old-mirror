# What Is `std::array` And Why Should I Use It?

C-style arrays have a few properties that make them annoying to use. They:

:no_entry: cannot be returned from functions<br>
:no_entry: are non-assignable<br>
:no_entry: can only be initialized via `""`, `{}`, or *[default initialization](https://en.cppreference.com/w/cpp/language/default_initialization)*<br>
:no_entry: cannot be passed to functions by value, but *[decay](https://64.github.io/cpp-faq/decay/)* to pointers<br>
:warning: might implicitly turn into pointers, which is called *[array-to-pointer conversion](https://en.cppreference.com/w/cpp/language/implicit_conversion#Array-to-pointer_conversion)*<br>
:warning: might be [variable-length arrays](https://en.wikipedia.org/wiki/Variable-length_array) (VLAs), if the developer makes a mistake

**[std::array](https://en.cppreference.com/w/cpp/container/array)** is a standard library
*[SequenceContainer](https://en.cppreference.com/w/cpp/named_req/SequenceContainer)* and
*[aggregate type](https://en.cppreference.com/w/cpp/language/aggregate_initialization)*
which solves these problems.
Usually, it's implemented along the lines of:
```cpp
template <typename T, size_t N>
struct array {
    T data[N]; // and other members ...
};
```
## Example Usage
```cpp
int arr[] = { 1, 2, 3 };              // turns into ...
std::array<int, 3> arr = { 1, 2, 3 }; // or ...
std::array arr = { 1, 2, 3 };         // (CTAD, since C++17)
```

## See Also
- [CppCoreGuidelines: Use `std::array` [...] for arrays on the stack](http://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Res-stack)<br>
<:stackoverflow:1074747016644661258>
[std::array vs array performance](https://stackoverflow.com/q/30263303/5740428)
