import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import getConfig from "next/config";
import { useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import { Dictionary } from "lodash";
import groupBy from "lodash/groupBy";
import { Book } from "@/types/book";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Select,
  SelectItem,
  getKeyValue,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { FcDeleteRow, FcPlus } from "react-icons/fc";

const { publicRuntimeConfig } = getConfig();

const readingStatuses = [
  { id: "to_read", name: "to_read" },
  { id: "reading", name: "reading" },
  { id: "read", name: "read" },
];

export default function IndexPage() {
  const { data: session, status } = useSession();
  const [readingList, setReadingList] = useState<Dictionary<Book[]> | null>(
    null
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [readingStatus, setReadingStatus] = useState("");
  const router = useRouter();

  const accessToken = session?.user?.accessToken;

  async function getBooks() {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SERVICE_URL ||
        publicRuntimeConfig.NEXT_PUBLIC_SERVICE_URL
      }`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      const grouped = groupBy(await response.json(), "status");
      setReadingList(grouped);
      router.push("/");
    } else {
      alert(`Something went wrong!"`);
    }
  }

  useEffect(() => {
    if (accessToken) {
      try {
        getBooks();
      } catch (e) {
        signOut({ callbackUrl: "/" });
      }
    }
  }, [accessToken]);

  const onSave = () => {
    async function setBooks() {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_SERVICE_URL ||
            publicRuntimeConfig.NEXT_PUBLIC_SERVICE_URL
          }`,
          {
            method: "POST",
            body: JSON.stringify({
              title: name,
              author: author,
              status: readingStatus,
            }),
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          alert("Book updated successfully!");
          router.push("/");
        } else {
          alert(`Session expired. Something went wrong!`);
          signOut({ callbackUrl: "/" });
        }
      } catch (e) {
        alert(`Something went wrong!"`);
      } finally {
        onOpenChange();
      }
    }
    setBooks();
  };
  async function deleteBook(id: string): Promise<void> {
    await fetch(
      `${
        process.env.NEXT_PUBLIC_SERVICE_URL ||
        publicRuntimeConfig.NEXT_PUBLIC_SERVICE_URL
      }?id=${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    alert("Book is deleted successfully");
    router.push("/");
  }
  if (status === "loading") {
    return <div>Authenticating...</div>;
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: "violet" })}>Reading List&nbsp;</h1>
          <br />
          <h4 className={subtitle({ class: "mt-4" })}>
            Manage your Reading Lists here!
          </h4>
        </div>

        <div className="flex gap-3">
          {!session?.user ? (
            <Button
              variant="ghost"
              color="secondary"
              onPress={(e) => {
                signIn("asgardeo", { callbackUrl: "/" });
              }}
            >
              {" "}
              Login with Asgardeo
            </Button>
          ) : (
            <>
              <div className=" max-w-lg text-center justify-center">
                <Button
                  variant="ghost"
                  color="danger"
                  onPress={() => {
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  {" "}
                  Logout
                </Button>
                <Button onPress={onOpen} color="secondary" variant="ghost">
                  <FcPlus />
                  Add Todo
                </Button>

                <Modal
                  backdrop="opaque"
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  radius="lg"
                  classNames={{
                    body: "py-6",
                    backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                    base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
                    header: "border-b-[1px] border-[#292f46]",
                    footer: "border-t-[1px] border-[#292f46]",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                  }}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Add Book
                        </ModalHeader>
                        <ModalBody>
                          <Input
                            type="text"
                            label="Title"
                            onChange={(e) => setName(e.target.value)}
                          />

                          <Input
                            type="text"
                            label="Author"
                            onChange={(e) => setAuthor(e.target.value)}
                          />

                          <Select
                            items={readingStatuses}
                            label="Reading Status"
                            placeholder="Select status"
                            className="max-w-xs"
                            onChange={(e) => setReadingStatus(e.target.value)}
                          >
                            {(stat) => (
                              <SelectItem key={stat.id}>{stat.name}</SelectItem>
                            )}
                          </Select>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="primary"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button
                            className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20"
                            onPress={onSave}
                          >
                            Save
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
              <div className="flow-root max-w-lg text-center justify-center">
                {readingList && (
                  <div className="inline-block max-w-lg text-center justify-center">
                    <Tabs
                      key="books"
                      color="secondary"
                      aria-label="Tabs colors"
                      radius="full"
                    >
                      <Tab key="reading" title="Reading">
                        <Table
                          aria-label="Example empty table"
                          fullWidth={true}
                        >
                          <TableHeader>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>AUTHOR</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>DELETE</TableColumn>
                          </TableHeader>
                          <TableBody emptyContent={"No rows to display."}>
                            {readingList.reading &&
                              readingList.reading.map((book) => (
                                <TableRow key={book.id}>
                                  <TableCell>{book.title}</TableCell>
                                  <TableCell>{book.author}</TableCell>
                                  <TableCell>{book.status}</TableCell>
                                  <TableCell>
                                    <Button
                                      onPress={() => deleteBook(book.id || "")}
                                    >
                                      <FcDeleteRow size={28} />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Tab>
                      <Tab key="to_read" title="To Read">
                        <Table aria-label="Example empty table">
                          <TableHeader>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>AUTHOR</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>DELETE</TableColumn>
                          </TableHeader>
                          <TableBody emptyContent={"No rows to display."}>
                            {readingList.to_read &&
                              readingList.to_read.map((book) => (
                                <TableRow key={book.id}>
                                  <TableCell>{book.title}</TableCell>
                                  <TableCell>{book.author}</TableCell>
                                  <TableCell>{book.status}</TableCell>
                                  <TableCell>
                                    <Button
                                      onPress={() => deleteBook(book.id || "")}
                                    >
                                      <FcDeleteRow size={28} />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Tab>
                      <Tab key="read" title="Read">
                        <Table aria-label="Example empty table">
                          <TableHeader>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>AUTHOR</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>DELETE</TableColumn>
                          </TableHeader>
                          <TableBody emptyContent={"No rows to display."}>
                            {readingList.read &&
                              readingList.read.map((book) => (
                                <TableRow key={book.id}>
                                  <TableCell>{book.title}</TableCell>
                                  <TableCell>{book.author}</TableCell>
                                  <TableCell>{book.status}</TableCell>
                                  <TableCell>
                                    <Button
                                      onPress={() => deleteBook(book.id || "")}
                                    >
                                      <FcDeleteRow size={28} />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Tab>
                    </Tabs>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
export async function getServerSideProps(context: any) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}
