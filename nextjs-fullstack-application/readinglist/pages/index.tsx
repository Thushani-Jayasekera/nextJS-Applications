import { title, subtitle } from "@/components/themes";
import DefaultLayout from "@/layouts/default";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Dictionary } from "lodash";
import groupBy from "lodash/groupBy";
import { Book } from "@/types/book";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { FcDeleteRow } from "react-icons/fc";

export default function IndexPage() {
  const { data: session, status } = useSession();
  const [readingList, setReadingList] = useState<Dictionary<Book[]> | null>(
    null
  );
  const router = useRouter();

  const accessToken = session?.user?.accessToken;

  async function getBooks() {
    const response = await fetch(`/api/books`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const grouped = groupBy(await response.json(), "status");
      setReadingList(grouped);
      router.push("/");
    } else {
      alert(`Something went wrong!"`);
    }
  }

  async function deleteBook(id: string): Promise<void> {
    await fetch(`/api/books?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    alert("Book is deleted successfully");
    router.push("/");
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

  if (status === "loading") {
    return <div>Authenticating...</div>;
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <h1 className={title({ color: "title" })}>Reading List&nbsp;</h1>
          <br />
          <h4 className={subtitle({ class: "mt-4" })}>
            Manage your Reading Lists here!
          </h4>
        </div>

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
            {readingList && (
              <div className="inline-block w-full text-center justify-center">
                <Tabs
                  key="books"
                  color="secondary"
                  aria-label="Tabs colors"
                  radius="full"

                >
                  <Tab key="reading" title="Reading">
                    <Table aria-label="Example empty table" fullWidth={true}>
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
          </>
        )}
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
